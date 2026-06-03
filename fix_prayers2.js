const fs = require('fs');

async function translateText(text) {
  if (!text || text.trim() === '') return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(item => item[0]).join('');
  } catch (e) {
    console.error("Translation error:", e);
    return text;
  }
}

async function run() {
  const data = JSON.parse(fs.readFileSync('current_prayers.json', 'utf8'));
  let patchData = [];
  
  for(let i = 0; i < data.length; i++) {
    const p = data[i];
    const id = p.name.split('/').pop();
    const titleEn = p.fields.titleEn?.stringValue || '';
    const titleTa = p.fields.titleTa?.stringValue || '';
    const contentEn = p.fields.contentEn?.stringValue || '';
    const contentTa = p.fields.contentTa?.stringValue || '';
    
    // Check if titleEn contains Tamil characters or is identical to titleTa
    const hasTamil = /[\u0B80-\u0BFF]/.test(titleEn);
    const isIdentical = (titleEn.trim() === titleTa.trim() && titleTa.trim() !== '');
    
    if (hasTamil || isIdentical || titleEn.trim() === '') {
      console.log(`Translating: ${id} (${titleTa})`);
      const newTitleEn = await translateText(titleTa);
      const newContentEn = await translateText(contentTa);
      
      const newDoc = {
          id: id,
          titleTa: titleTa,
          contentTa: contentTa,
          titleEn: newTitleEn,
          contentEn: newContentEn,
          category: p.fields.category?.stringValue || '',
          source_category: p.fields.source_category?.stringValue || ''
      };
      patchData.push(newDoc);
      await new Promise(r => setTimeout(r, 200)); // Be nice to translate API
    }
  }
  
  fs.writeFileSync('catholic_prayers_fixed_2.json', JSON.stringify(patchData, null, 2));
  console.log(`Successfully generated translations for ${patchData.length} prayers.`);
}
run();
