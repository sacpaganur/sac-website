const https = require('https');
const fs = require('fs');

const url = "https://raw.githubusercontent.com/godlytalias/Bible-Database/master/Tamil/bible.json";

https.get(url, (res) => {
    const chunks = [];
    res.on('data', (chunk) => {
        chunks.push(chunk);
    });
    res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const data = buffer.toString('utf8');
        fs.writeFileSync('d:\\SAC Website\\data\\tamil-bible.json', data, 'utf8');
        console.log("Downloaded Tamil Bible JSON properly");
    });
}).on('error', (err) => {
    console.error("Error: ", err.message);
});
