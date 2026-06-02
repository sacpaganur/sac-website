const fs = require('fs');
const path = require('path');

const dir = __dirname;
const newVersion = Date.now();

// 1. Update HTML files
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        // Replace src="js/filename.js?v=something" with src="js/filename.js?v=newVersion"
        const updated = content.replace(/src="(js\/[^"]+\.js)(?:\?v=[^"]+)?"/g, `src="$1?v=${newVersion}"`);
        if (content !== updated) {
            fs.writeFileSync(path.join(dir, file), updated);
            console.log(`Updated ${file}`);
        }
    }
});

// 2. Update firebase.json
const firebaseJsonPath = path.join(dir, 'firebase.json');
let firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));

firebaseJson.hosting.forEach(site => {
    let hasJsCacheRule = false;
    site.headers.forEach(headerRule => {
        if (headerRule.source === "**/*.js") {
            hasJsCacheRule = true;
        }
    });
    
    if (!hasJsCacheRule) {
        site.headers.push({
            "source": "**/*.js",
            "headers": [
                { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
            ]
        });
    }
});

fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2));
console.log('Updated firebase.json');
