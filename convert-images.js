const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

async function convertImages() {
  const files = fs.readdirSync(imgDir);
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const inputPath = path.join(imgDir, file);
      const outputPath = path.join(imgDir, `${base}.webp`);
      
      console.log(`Converting ${file} to WebP...`);
      try {
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
          
        console.log(`Successfully converted. Deleting original: ${file}`);
        fs.unlinkSync(inputPath);
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }
  }
  console.log('All images converted!');
}

convertImages();
