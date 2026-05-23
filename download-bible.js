const https = require('https');
const fs = require('fs');

const url = "https://raw.githubusercontent.com/godlytalias/Bible-Database/master/Tamil/bible.json";

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        fs.writeFileSync('d:\\SAC Website\\data\\tamil-bible.json', data);
        console.log("Downloaded Tamil Bible JSON");
    });
}).on('error', (err) => {
    console.error("Error: ", err.message);
});
