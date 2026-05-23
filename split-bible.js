const fs = require('fs');

const protestantBooks = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
    "1Samuel", "2Samuel", "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra", "Nehemiah", "Esther", 
    "Job", "Psalms", "Proverbs", "Ecclesiastes", "SongOfSolomon", "Isaiah", "Jeremiah", "Lamentations", 
    "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", 
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians", "Galatians", 
    "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy", "2Timothy", 
    "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter", "1John", "2John", "3John", "Jude", "Revelation"
];

const rawData = require('./data/tamil-bible.json');

if (!fs.existsSync('./data/bible')) fs.mkdirSync('./data/bible');
if (!fs.existsSync('./data/bible/ta')) fs.mkdirSync('./data/bible/ta');

rawData.Book.forEach((book, bookIndex) => {
    const bookId = protestantBooks[bookIndex];
    if (!bookId) return;
    
    const bookData = {};
    
    book.Chapter.forEach((chapter, chapterIndex) => {
        const chapterNum = chapterIndex + 1;
        bookData[chapterNum] = [];
        
        chapter.Verse.forEach(verseObj => {
            bookData[chapterNum].push(verseObj.Verse);
        });
    });
    
    fs.writeFileSync(`./data/bible/ta/${bookId}.json`, JSON.stringify(bookData));
});

console.log("Splitting complete!");
