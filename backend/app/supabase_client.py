"""
Supabase Storage Client - Módulo centralizado para subida de imágenes.
Todas las imágenes se almacenan en Supabase Storage en vez del disco local.
"""
import logging
import os
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("supabase_client")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")  # service_role key
BUCKET_NAME = "images"

def _get_client() -> Client:
    """Creates and returns a Supabase client instance."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_image(file_bytes: bytes, filename: str, folder: str = "", content_type: str = "image/webp") -> str:
    """
    Uploads an image to Supabase Storage and returns its public URL.
    
    Args:
        file_bytes: The image file content as bytes.
        filename: Name for the file (e.g., 'avatar_uuid.webp').
        folder: Optional subfolder inside the bucket (e.g., 'avatars', 'cms').
        content_type: MIME type stored with the object (defaults to WebP, the
            format produced by the server-side optimizers).
    
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
        file_options={"content-type": content_type, "upsert": "true"}
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

def create_signed_upload(file_path: str) -> dict:
    """
    Creates a signed upload URL so the browser can PUT a file straight to
    Supabase Storage (bypassing the 4.5 MB request limit of Vercel Functions).

    Returns a dict with: signed_url, token, path, public_url.
    """
    client = _get_client()
    bucket = client.storage.from_(BUCKET_NAME)
    signed = bucket.create_signed_upload_url(file_path)
    return {
        "signed_url": signed.get("signed_url") or signed.get("signedUrl"),
        "token": signed["token"],
        "path": signed.get("path", file_path),
        "public_url": bucket.get_public_url(file_path),
    }

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
    if url and marker in url:
        # Drop any query string (e.g. cache busters) from the object path
        return url.split(marker, 1)[1].split("?", 1)[0]
    return ""

def delete_file_by_url(url: Optional[str]) -> None:
    """
    Best-effort removal of a file we host, given its public URL.
    External URLs (YouTube, other hosts) are ignored. Never raises, so a
    storage hiccup can't break the database operation that triggered it.
    """
    try:
        if not url:
            return
        path = get_path_from_url(url)
        if path:
            delete_image(path)
    except Exception as exc:  # pragma: no cover - defensive
        logger.warning("Storage cleanup failed for %s: %s", url, exc)

def delete_replaced_files(old_urls, new_urls) -> None:
    """Deletes every hosted file present in old_urls but no longer in new_urls."""
    keep = {u for u in (new_urls or []) if u}
    for url in old_urls or []:
        if url and url not in keep:
            delete_file_by_url(url)
