import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const { state, vibe } = req.query;

    if (!state || !vibe) {
      return res.status(400).json({ error: 'Missing state or vibe' });
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1cFcNT3BthqjybMYcUJYBm2fG4dmmQwewdgkpBD6OR4o';
    const range = 'Party Matrix!A1:Z100';

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

    const [header, ...rows] = response.data.values;

    const data = rows.map(row =>
      header.reduce((acc, key, i) => {
        acc[key] = row[i] || '';
        return acc;
      }, {})
    );

    const match = data.find(
      item =>
        item['State']?.toLowerCase() === state.toLowerCase() &&
        item['Party Vibe']?.toLowerCase() === vibe.toLowerCase()
    );

    if (!match) return res.status(404).json({ error: 'No match found' });

    res.status(200).json(match);
  } catch (err) {
    console.error('Sheet API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
