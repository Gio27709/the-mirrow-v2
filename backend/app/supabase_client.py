"""
Supabase Storage Client - Módulo centralizado para subida de imágenes.
Todas las imágenes se almacenan en Supabase Storage en vez del disco local.
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")  # service_role key
BUCKET_NAME = "images"

def _get_client() -> Client:
    """Creates and returns a Supabase client instance."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_image(file_bytes: bytes, filename: str, folder: str = "") -> str:
    """
    Uploads an image to Supabase Storage and returns its public URL.
    
    Args:
        file_bytes: The image file content as bytes.
        filename: Name for the file (e.g., 'avatar_uuid.webp').
        folder: Optional subfolder inside the bucket (e.g., 'avatars', 'cms').
    
    Returns:
        The full public URL of the uploaded image.
    """
    client = _get_client()
    
    # Build the file path inside the bucket
    file_path = f"{folder}/{filename}" if folder else filename
    
    # Upload to Supabase Storage
    client.storage.from_(BUCKET_NAME).upload(
        path=file_path,
        file=file_bytes,
        file_options={"content-type": "image/webp", "upsert": "true"}
    )
    
    # Get the public URL
    public_url = client.storage.from_(BUCKET_NAME).get_public_url(file_path)
    
    return public_url

def upload_video(file_bytes: bytes, filename: str, content_type: str, folder: str = "") -> str:
    """
    Uploads a video to Supabase Storage and returns its public URL.
    """
    client = _get_client()
    file_path = f"{folder}/{filename}" if folder else filename
    
    # Upload to Supabase Storage
    client.storage.from_(BUCKET_NAME).upload(
        path=file_path,
        file=file_bytes,
        file_options={"content-type": content_type, "upsert": "true"}
    )
    
    # Get the public URL
    public_url = client.storage.from_(BUCKET_NAME).get_public_url(file_path)
    
    return public_url

def delete_image(file_path: str) -> bool:
    """
    Deletes an image from Supabase Storage.
    
    Args:
        file_path: The path of the file inside the bucket (e.g., 'avatars/uuid.webp').
    
    Returns:
        True if deletion was successful.
    """
    try:
        client = _get_client()
        client.storage.from_(BUCKET_NAME).remove([file_path])
        return True
    except Exception:
        return False

def get_path_from_url(url: str) -> str:
    """
    Extracts the file path from a Supabase Storage public URL.
    Used to delete old files when replacing (e.g., avatar update).
    
    Example:
        Input:  'https://xxx.supabase.co/storage/v1/object/public/images/avatars/file.webp'
        Output: 'avatars/file.webp'
    """
    marker = f"/storage/v1/object/public/{BUCKET_NAME}/"
    if marker in url:
        return url.split(marker)[1]
    return ""
