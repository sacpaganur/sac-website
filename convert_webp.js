const sharp = require('sharp');
const path = require('path');

const inputFile = "C:\\Users\\saint\\.gemini\\antigravity-ide\\brain\\ddafbec6-af3a-46cb-934a-0eb285ef400c\\media__1781174953663.jpg";
const outputFile = path.join(__dirname, 'images', 'hero_church_banner_altar.webp');

sharp(inputFile)
  .webp({ quality: 85 })
  .toFile(outputFile)
  .then(() => console.log('Successfully converted to WebP: ' + outputFile))
  .catch(err => console.error('Error converting image:', err));
