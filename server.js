const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const urlStore = {}; // In-memory storage (shortcode: longUrl)

// Shorten: POST /api/shorten { url: '...' }
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });
  const shortcode = nanoid(8);
  urlStore[shortcode] = url;
  res.json({ shortUrl: `https://mintlink.co/${shortcode}` });
});

// Redirect: GET /:shortcode
app.get('/:shortcode', (req, res) => {
  const longUrl = urlStore[req.params.shortcode];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Short URL not found.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
