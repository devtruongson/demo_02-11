import mysql from 'mysql2/promise';

async function fix() {
  const conn = await mysql.createConnection({
    host: '103.200.23.80',
    port: 3306,
    user: 'tinkerai4016_db_test',
    password: 'FstackDev@1234',
    database: 'tinkerai4016_db_test_17'
  });

  const [rows] = await conn.query('SELECT id, gallery, img FROM resources');
  for (const r of rows) {
    if (r.gallery) {
      try {
        const norm = r.gallery.replace(/'/g, '"');
        const parsed = JSON.parse(norm);
        if (Array.isArray(parsed)) {
          await conn.query('UPDATE resources SET gallery = ? WHERE id = ?', [JSON.stringify(parsed), r.id]);
        }
      } catch (e) {
        await conn.query('UPDATE resources SET gallery = ? WHERE id = ?', [JSON.stringify([r.img]), r.id]);
      }
    }
  }
  console.log(`Successfully normalized galleries for ${rows.length} resources in MySQL.`);
  await conn.end();
}

fix().catch(console.error);

