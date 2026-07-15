// Force relative API route calls to Next.js fullstack App Router internal endpoints
export const BASE_API_URL = '';
export const BASE_API_KEY = process.env.NEXT_PUBLIC_BASE_API_KEY || '91cf529ab452a9c2433bf051394323c4-50b513b6923e3a9fc066627a0f0324df-7d0599671fe1fc33a0b3d4cf2b0fdd34';

const DEFAULT_R2_PUBLIC_URL = 'https://pub-dde94dbcda2d41c3968385f7f9df0370.r2.dev';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || DEFAULT_R2_PUBLIC_URL;
  const cleanPath = path.replace(/^\/?storage\//, '').replace(/^\//, '');

  if (r2Url && r2Url !== 'GANTI_DENGAN_PUBLIC_URL_KAMU') {
    return `${r2Url.replace(/\/$/, '')}/${cleanPath}`;
  }
  return `${DEFAULT_R2_PUBLIC_URL}/${cleanPath}`;
};
