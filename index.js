// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { chromium } = require('playwright');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
async function installBrowsers() {
    try {
        await chromium.install();
    } catch (error) {
        console.error('Error installing browsers:', error);
    }
}
// API để crawl dữ liệu
app.post('/api/crawl', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });

        const textContent = await page.evaluate(() => {
            const elements = document.querySelectorAll('.list-group-item.list-group-item-info');
            return Array.from(elements).map(element => element.innerText);
        });

        await browser.close();

        // Trả về nội dung văn bản
        res.send({ text: textContent });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error });
    }
});

// Khởi động server
installBrowsers().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Error starting the server:', error);
});