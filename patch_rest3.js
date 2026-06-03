const fs = require('fs');

async function run() {
    const data = JSON.parse(fs.readFileSync('catholic_prayers_fixed_3.json', 'utf8'));
    console.log(`Loaded ${data.length} translated prayers. Starting PATCH to live DB...`);

    let successCount = 0;
    
    for(let i = 0; i < data.length; i++) {
        const p = data[i];
        
        const docBody = {
            name: `projects/stacpaganur/databases/(default)/documents/catholic_prayers/${p.id}`,
            fields: {
                titleTa: { stringValue: p.titleTa },
                contentTa: { stringValue: p.contentTa },
                titleEn: { stringValue: p.titleEn },
                contentEn: { stringValue: p.contentEn },
                category: { stringValue: p.category },
                source_category: { stringValue: p.source_category }
            }
        };

        const url = `https://firestore.googleapis.com/v1/projects/stacpaganur/databases/(default)/documents/catholic_prayers/${p.id}`;
        
        try {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docBody)
            });
            
            if(!res.ok) {
                const errText = await res.text();
                console.error(`Failed to patch ${p.id}: ${res.status} ${errText}`);
            } else {
                successCount++;
                if (successCount % 20 === 0) console.log(`Successfully patched ${successCount}/${data.length}...`);
            }
        } catch(err) {
            console.error(`Error on ${p.id}:`, err.message);
        }
        
        // Small delay to prevent rate limiting from REST API
        await new Promise(r => setTimeout(r, 50));
    }
    
    console.log(`DONE! Successfully updated ${successCount} prayers in Live Database.`);
}

run();
