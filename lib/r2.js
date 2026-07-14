import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload file ke Cloudflare R2 dan konversi ke AVIF
 * @param {Buffer} buffer - Buffer file yang akan diupload
 * @param {string} folder - Folder tujuan (contoh: 'berita', 'galeri', 'events')
 * @param {string} originalName - Nama file asli
 * @returns {string} path file di R2 (contoh: berita/abc123.avif)
 */
export async function uploadToR2(buffer, folder, originalName) {
  // Konversi ke AVIF menggunakan sharp
  const avifBuffer = await sharp(buffer)
    .avif({ quality: 75 })
    .toBuffer();

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.avif`;
  const key = `${folder}/${fileName}`;

  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: avifBuffer,
      ContentType: 'image/avif',
    },
  });

  await upload.done();
  return key;
}

/**
 * Hapus file dari Cloudflare R2
 * @param {string} key - Path file di R2 (contoh: berita/abc123.avif)
 */
export async function deleteFromR2(key) {
  if (!key) return;
  try {
    await r2Client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }));
  } catch (err) {
    console.error('Failed to delete from R2:', err);
  }
}

/**
 * Dapatkan URL publik dari key R2
 * @param {string} key - Path file di R2
 * @returns {string} URL publik lengkap
 */
export function getR2Url(key) {
  if (!key) return null;
  if (key.startsWith('http')) return key;
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}
