const https = require('https');
const fs = require('fs');
const path = require('path');

const books = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
    "1Samuel", "2Samuel", "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra", "Nehemiah", "Esther", 
    "Job", "Psalms", "Proverbs", "Ecclesiastes", "SongOfSolomon", "Isaiah", "Jeremiah", "Lamentations", 
    "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", 
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians", "Galatians", 
    "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy", "2Timothy", 
    "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter", "1John", "2John", "3John", "Jude", "Revelation"
];

const downloadBook = (book) => {
    return new Promise((resolve) => {
        const url = `https://raw.githubusercontent.com/aruljohn/Bible-tamil/master/json/${book}.json`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        // aruljohn format: { "book": "Genesis", "chapters": [ { "chapter": "1", "verses": [ { "verse": "1", "text": "ஆதியிலே..." } ] } ] }
                        // We need: { "1": ["ஆதியிலே..."], "2": [...] }
                        const optimized = {};
                        if (parsed.chapters) {
                            parsed.chapters.forEach(ch => {
                                const chNum = ch.chapter;
                                optimized[chNum] = ch.verses.map(v => v.text);
                            });
                        }
                        fs.writeFileSync(`d:\\SAC Website\\data\\bible\\ta\\${book}.json`, JSON.stringify(optimized, null, 2), 'utf8');
                        console.log(`Saved ${book}`);
                        resolve(true);
                    } catch(e) {
                        console.error(`Parse error for ${book}`);
                        resolve(false);
                    }
                } else {
                    console.error(`Failed ${book}: ${res.statusCode}`);
                    resolve(false);
                }
            });
        }).on('error', () => resolve(false));
    });
};

async function run() {
    for (const book of books) {
        await downloadBook(book);
    }
    console.log("All clean Tamil books downloaded.");
}

run();
