from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from supabase import create_client
from datetime import datetime, timezone
import os
import uuid
import mimetypes


SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')
SUPABASE_BUCKET = os.getenv('SUPABASE_BUCKET_NAME', 'shared-files')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# File size limit: 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes

def main(request):
    return render(request, 'main.html')

def generate_share_link(request):
    if request.method == 'POST':
        text_content = request.POST.get('text', '')
        
        link_id = str(uuid.uuid4())
        try:
            response = supabase.table('shared_texts').insert([{
                'id': link_id,
                'content': text_content,
                'created_at': datetime.now().isoformat() 
            }]).execute()

            share_link = f"{request.build_absolute_uri('/')}share/{link_id}"
            return JsonResponse({'link': share_link})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


def upload_file(request):
    """Handle file upload with 10MB limit"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)
    
    uploaded_file = request.FILES['file']
    
    # Check file size (10MB limit)
    if uploaded_file.size > MAX_FILE_SIZE:
        return JsonResponse({
            'error': f'File too large. Maximum size is 10MB. Your file is {uploaded_file.size / (1024 * 1024):.2f}MB'
        }, status=400)
    
    file_id = str(uuid.uuid4())
    original_name = uploaded_file.name
    file_extension = os.path.splitext(original_name)[1]
    storage_name = f"{file_id}{file_extension}"
    
    try:
        # Read file content
        file_content = uploaded_file.read()
        
        # Upload to Supabase Storage
        storage_response = supabase.storage.from_(SUPABASE_BUCKET).upload(
            path=storage_name,
            file=file_content,
            file_options={"content-type": uploaded_file.content_type}
        )
        
        # Store file metadata in database
        db_response = supabase.table('shared_files').insert([{
            'id': file_id,
            'original_name': original_name,
            'storage_name': storage_name,
            'file_size': uploaded_file.size,
            'content_type': uploaded_file.content_type,
            'created_at': datetime.now().isoformat()
        }]).execute()
        
        share_link = f"{request.build_absolute_uri('/')}file/{file_id}"
        return JsonResponse({
            'link': share_link,
            'filename': original_name,
            'size': uploaded_file.size
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def share_file(request, file_id):
    """Display file share page with download option"""
    try:
        response = supabase.table('shared_files') \
            .select('original_name, storage_name, file_size, content_type, created_at') \
            .eq('id', str(file_id)) \
            .execute()
        
        if not response.data:
            return render(request, 'error.html', {'message': 'File not found'})
        
        file_data = response.data[0]
        created_at = datetime.fromisoformat(file_data['created_at'])
        
        # Check expiration (24 hours)
        if (datetime.now(timezone.utc) - created_at).total_seconds() > 86400:
            return render(request, 'error.html', {'message': 'Link expired'})
        
        # Format file size
        size_bytes = file_data['file_size']
        if size_bytes < 1024:
            size_str = f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            size_str = f"{size_bytes / 1024:.1f} KB"
        else:
            size_str = f"{size_bytes / (1024 * 1024):.2f} MB"
        
        return render(request, 'share_file.html', {
            'file_id': file_id,
            'filename': file_data['original_name'],
            'file_size': size_str,
            'content_type': file_data['content_type'],
            'created_at': created_at
        })
        
    except Exception as e:
        return render(request, 'error.html', {'message': 'Error retrieving file'})


def download_file(request, file_id):
    """Handle file download"""
    try:
        response = supabase.table('shared_files') \
            .select('original_name, storage_name, content_type, created_at') \
            .eq('id', str(file_id)) \
            .execute()
        
        if not response.data:
            return render(request, 'error.html', {'message': 'File not found'})
        
        file_data = response.data[0]
        created_at = datetime.fromisoformat(file_data['created_at'])
        
        # Check expiration (24 hours)
        if (datetime.now(timezone.utc) - created_at).total_seconds() > 86400:
            return render(request, 'error.html', {'message': 'Link expired'})
        
        # Download from Supabase Storage
        file_content = supabase.storage.from_(SUPABASE_BUCKET).download(file_data['storage_name'])
        
        # Create response with file
        response = HttpResponse(file_content, content_type=file_data['content_type'])
        response['Content-Disposition'] = f'attachment; filename="{file_data["original_name"]}"'
        return response
        
    except Exception as e:
        return render(request, 'error.html', {'message': 'Error downloading file'})


def share_text(request, link_id):
    try:
        response = supabase.table('shared_texts') \
            .select('content, created_at') \
            .eq('id', link_id) \
            .execute()

        if not response.data:
            return render(request, 'error.html', {'message': 'Link not found'})
        
        text_data = response.data[0]
        content = text_data['content']
        created_at = datetime.fromisoformat(text_data['created_at'])
        
        # Check expiration (24 hours)
        if (datetime.now(timezone.utc) - created_at).total_seconds() > 86400:
            return render(request, 'error.html', {'message': 'Link expired'})
            
        return render(request, 'share_page.html', {
            'content': content,
            'created_at': created_at
        })
        
    except Exception as e:
        return render(request, 'error.html', {'message': 'Error retrieving content'})