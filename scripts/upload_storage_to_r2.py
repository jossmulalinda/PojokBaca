import os
import boto3
from botocore.config import Config

r2_access_key = "9dc0c56d035709e59b10e59c64910e8e"
r2_secret_key = "28dfdf0e0e5dedb61cfd649b427bbbd9395d7408bb7cca7d63dfe62f5c05c97f"
r2_endpoint = "https://82be0667519c355ed16662289e1ae75c.r2.cloudflarestorage.com"
bucket_name = "hmti-assets"

local_storage_dir = r"d:\Informatika\Semester 6\HMTI\focus-app.backend-master\focus-app.backend-master\storage\app\public"

s3 = boto3.client(
    "s3",
    endpoint_url=r2_endpoint,
    aws_access_key_id=r2_access_key,
    aws_secret_access_key=r2_secret_key,
    config=Config(signature_version="s3v4")
)

uploaded_count = 0

for root, dirs, files in os.walk(local_storage_dir):
    for file in files:
        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, local_storage_dir).replace("\\", "/")
        
        content_type = "image/jpeg"
        if file.endswith(".png"):
            content_type = "image/png"
        elif file.endswith(".avif"):
            content_type = "image/avif"
        elif file.endswith(".webp"):
            content_type = "image/webp"

        print(f"Uploading {rel_path} to R2...")
        try:
            s3.upload_file(
                full_path,
                bucket_name,
                rel_path,
                ExtraArgs={"ContentType": content_type}
            )
            uploaded_count += 1
            print(f"Uploaded {rel_path}")
        except Exception as e:
            print(f"Failed to upload {rel_path}: {e}")

print(f"Done! {uploaded_count} files uploaded to R2.")
