// api/kontext.js
const express = require('express');
const fetch = require('node-fetch'); // If you need to proxy requests
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic /kontext endpoint
app.get('/kontext', (req, res) => {
  res.json({ message: "Proxy is live!" });
});

// Example POST proxy (if you want to forward requests somewhere)
app.post('/kontext', async (req, res) => {
  try {
    const targetUrl = 'https://example.com/api'; // replace with your actual target
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Kontext proxy running on port ${port}`);
});
