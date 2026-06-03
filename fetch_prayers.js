const fs = require('fs');

async function fetchPrayers() {
  let docs = [];
  let pageToken = '';
  do {
    let url = 'https://firestore.googleapis.com/v1/projects/stacpaganur/databases/(default)/documents/catholic_prayers?pageSize=300';
    if(pageToken) url += '&pageToken=' + pageToken;
    const res = await fetch(url);
    const data = await res.json();
    if(data.documents) docs = docs.concat(data.documents);
    pageToken = data.nextPageToken;
  } while(pageToken);
  
  fs.writeFileSync('current_prayers.json', JSON.stringify(docs, null, 2));
  console.log(`Fetched ${docs.length} prayers.`);
}
fetchPrayers();
