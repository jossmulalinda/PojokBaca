const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: 'https://82be0667519c355ed16662289e1ae75c.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '9dc0c56d035709e59b10e59c64910e8e',
    secretAccessKey: '28dfdf0e0e5dedb61cfd649b427bbbd9395d7408bb7cca7d63dfe62f5c05c97f',
  },
});

const bucketName = 'hmti-assets';
const localStorageDir = path.join(__dirname, '../../focus-app.backend-master/focus-app.backend-master/storage/app/public');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadAll() {
  if (!fs.existsSync(localStorageDir)) {
    console.log('Local storage directory not found:', localStorageDir);
    return;
  }

  const allFiles = getAllFiles(localStorageDir);
  console.log(`Found ${allFiles.length} files to upload to R2...`);

  for (const filePath of allFiles) {
    const relPath = path.relative(localStorageDir, filePath).replace(/\\/g, '/');
    const fileBuffer = fs.readFileSync(filePath);
    
    let contentType = 'image/jpeg';
    if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.avif')) contentType = 'image/avif';
    else if (filePath.endsWith('.webp')) contentType = 'image/webp';

    console.log(`Uploading ${relPath} to R2...`);
    try {
      await r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: relPath,
        Body: fileBuffer,
        ContentType: contentType,
      }));
      console.log(`Uploaded: ${relPath}`);
    } catch (err) {
      console.error(`Failed to upload ${relPath}:`, err);
    }
  }

  console.log('Done uploading all files to Cloudflare R2!');
}

uploadAll();
