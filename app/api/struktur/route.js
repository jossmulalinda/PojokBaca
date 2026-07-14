import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

const trimStorage = (path) => {
  if (!path) return null;
  return path.replace(/^\/?storage\//, '').replace(/^\//, '');
};

export async function GET() {
  try {
    const db = getDb();

    // Get periode from pengurus
    const periodeResult = await db.execute('SELECT periode FROM pengurus WHERE periode IS NOT NULL LIMIT 1');
    const periode = periodeResult.rows.length > 0 ? periodeResult.rows[0].periode : '2024/2025';

    // Core leadership
    const ketumResult = await db.execute({ sql: 'SELECT id, nama, foto FROM pengurus WHERE jabatan = ? LIMIT 1', args: ['Ketua Umum'] });
    const sekumResult = await db.execute({ sql: 'SELECT id, nama, foto FROM pengurus WHERE jabatan IN (?, ?) LIMIT 1', args: ['Sekretaris Umum', 'Sekretaris'] });
    const bendumResult = await db.execute({ sql: 'SELECT id, nama, foto FROM pengurus WHERE jabatan = ? LIMIT 1', args: ['Bendahara Umum'] });

    const ketum = ketumResult.rows[0] ? { nama: ketumResult.rows[0].nama, foto: trimStorage(ketumResult.rows[0].foto) } : null;
    const sekum = sekumResult.rows[0] ? { nama: sekumResult.rows[0].nama, foto: trimStorage(sekumResult.rows[0].foto) } : null;
    const bendum = bendumResult.rows[0] ? { nama: bendumResult.rows[0].nama, foto: trimStorage(bendumResult.rows[0].foto) } : null;

    // Get all bidang
    const bidangResult = await db.execute('SELECT * FROM bidang ORDER BY id ASC');

    const bidangList = [];
    for (const b of bidangResult.rows) {
      const kabidResult = await db.execute({ sql: 'SELECT id, nama, foto FROM pengurus WHERE bidang_id = ? AND jabatan = ? LIMIT 1', args: [b.id, 'Ketua Bidang'] });
      const sekbidResult = await db.execute({ sql: 'SELECT id, nama, foto FROM pengurus WHERE bidang_id = ? AND jabatan = ? LIMIT 1', args: [b.id, 'Sekretaris Bidang'] });

      const kabid = kabidResult.rows[0] ? { id: kabidResult.rows[0].id, nama: kabidResult.rows[0].nama, foto: trimStorage(kabidResult.rows[0].foto) } : null;
      const sekbid = sekbidResult.rows[0] ? { id: sekbidResult.rows[0].id, nama: sekbidResult.rows[0].nama, foto: trimStorage(sekbidResult.rows[0].foto) } : null;

      // Get divisi
      const divisiResult = await db.execute({ sql: 'SELECT * FROM divisi WHERE bidang_id = ? ORDER BY id ASC', args: [b.id] });
      const divisiList = [];

      for (const d of divisiResult.rows) {
        const kadivResult = await db.execute({ sql: 'SELECT id, nama, foto FROM pengurus WHERE divisi_id = ? AND jabatan = ? LIMIT 1', args: [d.id, 'Ketua Divisi'] });
        const anggotaResult = await db.execute({ sql: 'SELECT id, nama FROM pengurus WHERE divisi_id = ? AND jabatan = ? ORDER BY id ASC', args: [d.id, 'Anggota'] });

        const kadiv = kadivResult.rows[0] ? { id: kadivResult.rows[0].id, nama: kadivResult.rows[0].nama, foto: trimStorage(kadivResult.rows[0].foto) } : null;

        divisiList.push({
          id: d.id,
          nama_divisi: d.nama_divisi,
          urutan: d.urutan,
          kadiv,
          anggota: anggotaResult.rows.map(m => ({ id: m.id, nama: m.nama }))
        });
      }

      bidangList.push({
        id: b.id,
        nama_bidang: b.nama_bidang,
        urutan: b.urutan,
        kabid,
        sekbid,
        divisi: divisiList
      });
    }

    return NextResponse.json({
      periode,
      ketum,
      sekum,
      bendum,
      bidang: bidangList
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
