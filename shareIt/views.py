import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_BUCKET_NAME = os.getenv("SUPABASE_BUCKET_NAME")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        file_ext = file.name.split('.')[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"

        # Upload file to Supabase Storage
        res = supabase.storage.from_(SUPABASE_BUCKET_NAME).upload(file_name, file.read())

        if res.get('error'):
            return JsonResponse({"error": res["error"]["message"]}, status=400)

        file_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET_NAME}/{file_name}"
        return JsonResponse({"message": "File uploaded", "url": file_url})
    
    return JsonResponse({"error": "No file provided"}, status=400)


def get_file_url(request, filename):
    file_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET_NAME}/{filename}"
    return JsonResponse({"url": file_url})
