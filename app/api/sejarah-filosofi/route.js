import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    sejarah: {
      id: 1,
      konten: 'Sejarah berdirinya HMTI dimulai pada tahun 2011 di bawah naungan Teknik Elektro. HMTI secara resmi berdiri pada tanggal 14 Juni 2014 melalui proses pelantikan, rapat kerja, dan musyawarah besar yang dihadiri oleh Angkatan 2011, 2012, dan 2013.',
      gambar: 'galeri/img1.png',
    },
    filosofi: {
      id: 2,
      konten: '<strong>Arti dari logo HMTI Yaitu:</strong><br><br><strong>• Segitiga (konsep religious & kokoh)</strong><br>Pada logo HMTI yang berbentuk segitiga memiliki arti yang religious yaitu terdiri dari unsur alam semesta yaitu Tuhan, Manusia, dan Alam.<br>- Konsep keluarga yaitu Ayah, Ibu, dan Anak<br>- Metafisika raga, pikiran, jiwa<br>- Konsep pelajar yaitu guru, buku, siswa/pelajar<br>Segitiga juga memiliki arti bahwa kita semua dari bawah mempunyai tujuan yang sama. Dilihat dari 2 sisi, segitiga memiliki bentuk yang kokoh yang apabila dibalik tetap akan menjadi segitiga dalam bentuk yang sama.<br><br><strong>• Bola Bumi</strong><br>Di tengah logo terdapat gambar bola bumi yang mengartikan bahwa dunia IT memiliki fungsi global atau tempat di mana kita mempelajari segala ilmu pengetahuan.<br><br><strong>• Komputer dan Jaringan</strong><br>Menandakan bahwa Teknik Informatika memiliki dua konsentrasi yaitu jaringan dan programming.<br><br><strong>• PC/Komputer</strong><br>Menunjukkan aktivitas IT.',
      gambar: 'galeri/img2.png',
    },
  });
}
