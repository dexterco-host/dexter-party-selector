
import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const { state, vibe } = req.query;
  if (!state || !vibe) return res.status(400).json({ error: 'Missing state or vibe' });

  try {
    const keyFilePath = path.join(process.cwd(), 'credentials', 'dexter-co-sheet-reader-f37d5a2dd149.json');
    const keyFile = await fs.readFile(keyFilePath, 'utf8');
    const credentials = JSON.parse(keyFile);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1cFcNT3BthqjybMYcUJYBm2fG4dmmQwewdgkpBD6OR4o';
    const range = 'Party Matrix!A1:Z100';

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const [headers, ...rows] = response.data.values;
    const data = rows.map(row => Object.fromEntries(headers.map((key, i) => [key, row[i] || ''])));
    const match = data.find(item => item['State'] === state && item['Party Vibe'] === vibe);

    if (!match) return res.status(404).json({ error: 'No match found' });
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
