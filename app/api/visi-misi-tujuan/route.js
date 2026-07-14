import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    visi: {
      judul: 'VISI HMTI',
      konten: 'Menjadi himpunan mahasiswa yang aktif, inovatif, dan kolaboratif dalam mewujudkan mahasiswa Teknik Informatika Universitas Khairun yang berintegritas tinggi serta berdaya saing global di era transformasi digital.',
    },
    misi: {
      judul: 'MISI HMTI',
      konten: '1. Menyelenggarakan kegiatan peningkatan kompetensi akademik dan non-akademik mahasiswa.<br>2. Membangun relasi dan sinergi yang harmonis antar mahasiswa, dosen, alumni, serta masyarakat.<br>3. Mendorong riset, inovasi, dan pengabdian masyarakat berbasis teknologi informasi.',
    },
    tujuan: {
      judul: 'TUJUAN HMTI',
      konten: 'Mencetak lulusan Teknik Informatika yang berkarakter unggul, menguasai teknologi terkini, serta siap berkontribusi positif bagi kemajuan digitalisasi di Indonesia Timur khususnya Maluku Utara.',
    },
  });
}
