const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const projectDir = __dirname;

// Get all images
const images = fs.readdirSync(imagesDir).filter(f => fs.statSync(path.join(imagesDir, f)).isFile());

// Function to recursively get all relevant files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.firebase' && file !== 'images') {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.html', '.css', '.js'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const codeFiles = getAllFiles(projectDir);
const fileContents = codeFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

const unusedImages = [];

images.forEach(img => {
  // Check if the image name exists anywhere in the combined text of all code files
  if (!fileContents.includes(img)) {
    unusedImages.push(img);
  }
});

console.log("Found unused images:", unusedImages);

unusedImages.forEach(img => {
  const filePath = path.join(imagesDir, img);
  fs.unlinkSync(filePath);
  console.log("Deleted:", img);
});
