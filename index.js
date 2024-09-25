// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API để crawl dữ liệu
app.post('/api/crawl', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(url);
        const data = response.data;

        const $ = cheerio.load(data);
        const result = [];

        $('h1').each((index, element) => {
            result.push($(element).text());
        });

        res.send({ titles: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error crawling the URL' });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
