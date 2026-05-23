const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname)));

const server = app.listen(0, async () => {
    const port = server.address().port;
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('pageerror', err => {
            console.log('PAGE ERROR:', err.message);
            console.log('STACK:', err.stack);
        });
        
        page.on('error', err => {
            console.log('ERROR:', err.message);
        });

        // Evaluate on new document to catch everything
        await page.evaluateOnNewDocument(() => {
            window.addEventListener('error', e => {
                console.log(`GLOBAL ERROR: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`);
            });
        });

        page.on('console', msg => console.log('CONSOLE:', msg.text()));
        
        await page.goto(`http://localhost:${port}/bible.html`, { waitUntil: 'networkidle0' });
        
        await browser.close();
        server.close();
    } catch (e) {
        console.error("Puppeteer error:", e);
        server.close();
    }
});
