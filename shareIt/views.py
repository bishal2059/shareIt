from django.http import JsonResponse
from django.shortcuts import render, redirect
from supabase import create_client
from datetime import datetime, timezone
import os
import uuid


SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

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


def share_text(request, link_id):
    print('here')
    try:
        response = supabase.table('shared_texts') \
            .select('content, created_at') \
            .eq('id', link_id) \
            .execute()
        print('here')
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