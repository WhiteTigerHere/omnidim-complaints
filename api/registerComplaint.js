import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { summary, full_text, category, priority, group_id } = req.body;

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'connectizen'
    });

    const [result] = await db.execute(
      `INSERT INTO complaints (summary, full_text, category, priority, group_id)
       VALUES (?, ?, ?, ?, ?)`,
      [summary, full_text, category, priority, group_id]
    );

    res.status(200).json({ message: 'Complaint registered', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering complaint' });
  }
}
