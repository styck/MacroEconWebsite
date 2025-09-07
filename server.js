require('dotenv').config();
const express = require('express');
const fetch = globalThis.fetch || require('node-fetch@2');

const app = express();
const PORT = 3000;
const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY;

if (!API_KEY) {
  throw new Error("FRED_API_KEY is not set. Please create a .env file and add your API key.");
}

app.get('/api/fetch', async (req, res) => {
  const seriesId = req.query.series_id;
  const startDate = req.query.start_date || '2014-01-01';
  const endDate = req.query.end_date || '2025-12-31';

  const url = `${FRED_API_BASE}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&start_date=${startDate}&end_date=${endDate}`;
  console.log('Proxying to FRED:', url);

  try {
    const response = await fetch(url);
    console.log('FRED response status:', response.status);

    if (!response.ok) {
      console.log('FRED error body:', await response.text());
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error('Failed to fetch', seriesId, e);
    res.status(500).json({ error: 'Server fetch error' });
  }
});

app.use(express.static('.')); // Serve static files

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
