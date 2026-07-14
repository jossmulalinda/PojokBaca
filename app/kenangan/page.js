import { redirect } from 'next/navigation';

// Halaman /kenangan dialihkan ke /galery
// Konten galeri kini terpusat di satu halaman
export default function KenaganRedirect() {
  redirect('/galery');
}
