import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

const DEFAULT_R2_ENDPOINT = 'https://82be0667519c355ed16662289e1ae75c.r2.cloudflarestorage.com';
const DEFAULT_R2_ACCESS_KEY = '9dc0c56d035709e59b10e59c64910e8e';
const DEFAULT_R2_SECRET_KEY = '28dfdf0e0e5dedb61cfd649b427bbbd9395d7408bb7cca7d63dfe62f5c05c97f';
const DEFAULT_R2_BUCKET = 'hmti-assets';
const DEFAULT_R2_PUBLIC_URL = 'https://pub-dde94dbcda2d41c3968385f7f9df0370.r2.dev';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || DEFAULT_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || DEFAULT_R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || DEFAULT_R2_SECRET_KEY,
  },
});

export async function uploadToR2(buffer, folder, originalName = 'image.jpg') {
  let fileBuffer = buffer;
  let contentType = 'image/jpeg';
  let ext = 'jpg';

  const name = originalName.toLowerCase();
  if (name.endsWith('.png')) { contentType = 'image/png'; ext = 'png'; }
  else if (name.endsWith('.webp')) { contentType = 'image/webp'; ext = 'webp'; }
  else if (name.endsWith('.avif')) { contentType = 'image/avif'; ext = 'avif'; }

  try {
    fileBuffer = await sharp(buffer)
      .avif({ quality: 75 })
      .toBuffer();
    contentType = 'image/avif';
    ext = 'avif';
  } catch (err) {
    console.warn('Sharp AVIF conversion warning, using raw buffer:', err.message);
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const key = `${folder}/${fileName}`;
  const bucket = process.env.R2_BUCKET_NAME || DEFAULT_R2_BUCKET;

  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    },
  });

  await upload.done();
  return key;
}

export async function deleteFromR2(key) {
  if (!key) return;
  const bucket = process.env.R2_BUCKET_NAME || DEFAULT_R2_BUCKET;
  try {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }));
  } catch (err) {
    console.error('Failed to delete from R2:', err);
  }
}

export function getR2Url(key) {
  if (!key) return null;
  if (key.startsWith('http')) return key;
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || DEFAULT_R2_PUBLIC_URL;
  return `${publicUrl.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
}
