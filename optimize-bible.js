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
const optimized = {};

rawData.Book.forEach((book, bookIndex) => {
    const bookId = protestantBooks[bookIndex];
    if (!bookId) return;
    
    optimized[bookId] = {};
    
    book.Chapter.forEach((chapter, chapterIndex) => {
        const chapterNum = chapterIndex + 1;
        optimized[bookId][chapterNum] = [];
        
        chapter.Verse.forEach(verseObj => {
            optimized[bookId][chapterNum].push(verseObj.Verse);
        });
    });
});

fs.writeFileSync('./data/tamil-bible-optimized.json', JSON.stringify(optimized));
console.log("Optimization complete!");
