const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint to fetch the download link
app.get('/download', async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).json({ error: 'Please provide a valid TeraBox file URL.' });
  }

  try {
    // Fetch the TeraBox page
    const response = await axios.get(fileUrl);
    const html = response.data;

    // Parse the HTML to find the download link
    const $ = cheerio.load(html);
    const downloadLink = $('a[download]').attr('href');

    if (!downloadLink) {
      return res.status(404).json({ error: 'Download link not found. Make sure the URL is correct.' });
    }

    res.json({ downloadLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
