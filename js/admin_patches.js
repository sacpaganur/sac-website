// This file overrides and patches functions in sac-admin-portal.html safely without modifying the monolith directly.

// 1. Override the DB connection status badge — with retry loop to wait for Firebase CDN
window.updateDBConnectionStatusBadge = function() {
    try {
        // If Firebase CDN has loaded but SAC_DATABASE hasn't connected yet, do it now
        if (typeof SAC_DATABASE !== 'undefined' && !SAC_DATABASE.isFirebaseActive && window.firebase) {
            try { SAC_DATABASE.setupFirebaseConnection(); } catch(e) { console.error(e); }
        }
        
        const badge = document.getElementById('db-status-badge');
        if (!badge) return;
        
        const isTa = (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta');
        
        if (typeof SAC_DATABASE !== 'undefined' && SAC_DATABASE.isFirebaseActive) {
            badge.className = 'liturgical-badge liturgical-easter';
            badge.innerHTML = isTa ? "\u0BB2\u0BC8\u0BB5\u0BCD \u0B9F\u0BC7\u0B9F\u0BCD\u0B9F\u0BBE\u0BAA\u0BC7\u0BB8\u0BCD \u0B87\u0BA3\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA4\u0BC1" : "Firebase Firestore Connected";
        } else {
            badge.className = 'liturgical-badge liturgical-lent';
            badge.innerHTML = isTa ? "\u0BB2\u0BCB\u0B95\u0BCD\u0B95\u0BB2\u0BCD \u0B9F\u0BC7\u0B9F\u0BCD\u0B9F\u0BBE\u0BAA\u0BC7\u0BB8\u0BCD" : "Local Storage Mode";
        }
    } catch(e) {
        console.error("Badge error:", e);
    }
};

// Helper function to dynamically sync and refresh all admin tabs when Firebase connects
window.refreshAllAdminData = async function() {
    if (sessionStorage.getItem('sac_admin_logged_in') !== 'true') return;
    console.log("Firebase Firestore connected successfully! Refreshing all administrative panels with live data...");
    try { if (typeof populateGeneralSettings === 'function') await populateGeneralSettings(); } catch(e){}
    try { if (typeof populateMassSchedulesList === 'function') await populateMassSchedulesList(); } catch(e){}
    try { if (typeof populateNoticesList === 'function') await populateNoticesList(); } catch(e){}
    try { if (typeof populateTimelineList === 'function') await populateTimelineList(); } catch(e){}
    try { if (typeof populatePastOfficialsList === 'function') await populatePastOfficialsList(); } catch(e){}
    try { if (typeof populateGalleryList === 'function') await populateGalleryList(); } catch(e){}
    try { if (typeof populateCatholicPrayersList === 'function') await populateCatholicPrayersList(); } catch(e){}
    try { if (typeof populatePrayersList === 'function') await populatePrayersList(); } catch(e){}
    try { if (typeof populateDatabaseConfig === 'function') await populateDatabaseConfig(); } catch(e){}
    try { if (typeof populateSubscriberCount === 'function') await populateSubscriberCount(); } catch(e){}
};

// Retry badge update every 1s for up to 10s until Firebase connects
(function retryBadge() {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(function() {
        attempts++;
        var wasConnected = typeof SAC_DATABASE !== 'undefined' && SAC_DATABASE.isFirebaseActive;
        
        // Try to connect if firebase CDN is now available
        if (typeof SAC_DATABASE !== 'undefined' && !SAC_DATABASE.isFirebaseActive && window.firebase) {
            try { SAC_DATABASE.setupFirebaseConnection(); } catch(e) {}
        }
        // Update badge
        if (typeof window.updateDBConnectionStatusBadge === 'function') {
            window.updateDBConnectionStatusBadge();
        }
        
        var isConnected = typeof SAC_DATABASE !== 'undefined' && SAC_DATABASE.isFirebaseActive;
        
        // Stop retrying once connected or max attempts reached
        if (isConnected || attempts >= maxAttempts) {
            clearInterval(interval);
            // Sync all panels instantly on transition
            if (isConnected && !wasConnected && typeof window.refreshAllAdminData === 'function') {
                window.refreshAllAdminData();
            }
        }
    }, 1000);
})();

// 2. Dynamic single translation logic
window.autoTranslatePrayerToEnglish = async function() {
    var titleTa = document.getElementById('cp-titleTa').value;
    var contentTa = document.getElementById('cp-contentTa').value;
    if(!titleTa && !contentTa) { alert("Please enter Tamil content first."); return; }
    
    var btn = document.getElementById('cp-btn-translate');
    if(!btn) return;
    var oldText = btn.innerHTML;
    btn.innerHTML = "Translating..."; btn.disabled = true;
    
    var translate = async function(text) {
        if(!text) return "";
        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t";
        var res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'q=' + encodeURIComponent(text) });
        var json = await res.json();
        var translated = "";
        if (json && json[0]) { json[0].forEach(function(t) { if(t[0]) translated += t[0]; }); }
        return translated;
    };
    
    try {
        if(titleTa && !document.getElementById('cp-titleEn').value) document.getElementById('cp-titleEn').value = await translate(titleTa);
        else if(titleTa && confirm("Overwrite existing English Title?")) document.getElementById('cp-titleEn').value = await translate(titleTa);
        
        if(contentTa && !document.getElementById('cp-contentEn').value) document.getElementById('cp-contentEn').value = await translate(contentTa);
        else if(contentTa && confirm("Overwrite existing English Content?")) document.getElementById('cp-contentEn').value = await translate(contentTa);
    } catch(e) { console.error(e); alert("Translation failed."); }
    
    btn.innerHTML = oldText; btn.disabled = false;
};

// 3. High-Speed HTML Batch Translation Logic
window.bulkTranslatePrayers = async function(e) {
    if(!confirm("Translate all 600+ Tamil prayers to English using high-speed HTML batching? This will complete in ~1 minute directly in your browser without rate limits.")) return;
    var btn = e.currentTarget;
    var originalHtml = btn.innerHTML;
    btn.innerHTML = 'Translating...'; btn.disabled = true;

    try {
        var prayers = await SAC_DATABASE.get("catholic_prayers");
        if(!prayers || prayers.length === 0) {
            alert("No prayers found to translate.");
            btn.innerHTML = originalHtml; btn.disabled = false; return;
        }

        var isTamil = function(str) { return /[\u0B80-\u0BFF]/.test(str || ""); };
        var toTranslate = prayers.filter(p => isTamil(p.titleEn) || isTamil(p.contentEn) || !p.titleEn || !p.contentEn);
        
        if (toTranslate.length === 0) {
            alert("All prayers are already translated!");
            btn.innerHTML = originalHtml; btn.disabled = false; return;
        }

        var translateHTML = async function(htmlPayload) {
            var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t";
            var res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'q=' + encodeURIComponent(htmlPayload)
            });
            if (!res.ok) throw new Error("Translation request failed");
            var json = await res.json();
            var translated = "";
            if (json && json[0]) {
                json[0].forEach(function(t) {
                    if (t[0]) translated += t[0];
                });
            }
            return translated;
        };

        var batchSize = 15;
        var completedCount = 0;

        for (var i = 0; i < toTranslate.length; i += batchSize) {
            var chunk = toTranslate.slice(i, i + batchSize);
            
            // Build HTML payload
            var html = "";
            chunk.forEach(function(p) {
                var titleText = isTamil(p.titleEn) || !p.titleEn ? (p.titleTa || p.title || "Untitled") : p.titleEn;
                var contentText = isTamil(p.contentEn) || !p.contentEn ? (p.contentTa || p.content || "") : p.contentEn;
                
                // Add unique custom tags
                html += '<t id="' + p.id + '">' + titleText.trim() + '</t>\n';
                html += '<c id="' + p.id + '">' + contentText.trim() + '</c>\n';
            });

            btn.innerHTML = 'Translating chunk ' + (Math.floor(i/batchSize) + 1) + ' of ' + Math.ceil(toTranslate.length/batchSize) + '...';

            try {
                var translatedHtml = await translateHTML(html);
                
                // Parse returned HTML using a browser DOM parser
                var parser = new DOMParser();
                var doc = parser.parseFromString('<div>' + translatedHtml + '</div>', 'text/html');
                
                chunk.forEach(function(p) {
                    var titleEl = doc.querySelector('t[id="' + p.id + '"]');
                    var contentEl = doc.querySelector('c[id="' + p.id + '"]');
                    
                    if (titleEl && titleEl.textContent.trim()) {
                        p.titleEn = titleEl.textContent.trim();
                    }
                    if (contentEl && contentEl.textContent.trim()) {
                        p.contentEn = contentEl.textContent.trim();
                    }
                });

                completedCount += chunk.length;
                btn.innerHTML = 'Translating... (' + completedCount + '/' + toTranslate.length + ')';
                
                // Small polite delay
                await new Promise(function(r) { setTimeout(r, 1200); });
            } catch (err) {
                console.warn("Batch failed, trying fallback individual translation for this chunk...", err);
                for (var j = 0; j < chunk.length; j++) {
                    var p = chunk[j];
                    var titleText = isTamil(p.titleEn) || !p.titleEn ? (p.titleTa || p.title || "") : p.titleEn;
                    var contentText = isTamil(p.contentEn) || !p.contentEn ? (p.contentTa || p.content || "") : p.contentEn;
                    
                    try {
                        var singleTrans = async function(text) {
                            if (!text) return "";
                            var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t";
                            var res = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: 'q=' + encodeURIComponent(text)
                            });
                            var json = await res.json();
                            var translated = "";
                            if (json && json[0]) {
                                json[0].forEach(function(t) { if (t[0]) translated += t[0]; });
                            }
                            return translated;
                        };
                        if (isTamil(p.titleEn) || !p.titleEn) p.titleEn = await singleTrans(titleText);
                        if (isTamil(p.contentEn) || !p.contentEn) p.contentEn = await singleTrans(contentText);
                        await new Promise(function(r) { setTimeout(r, 800); });
                    } catch(e) {}
                }
                completedCount += chunk.length;
            }
        }

        // Cache the translated list
        window.translatedPrayersCache = prayers;
        try { localStorage.setItem("sac_catholic_prayers", JSON.stringify(prayers)); } catch(e) {}

        alert("Bulk translation complete! Translated " + toTranslate.length + " prayers successfully.\n\nNow, click the green 'Sync to Firebase' button on the right to upload all translated English prayers permanently to your Firebase Firestore database!");
        await window.populateCatholicPrayersList();
    } catch(err) {
        console.error("Bulk translate failed:", err);
        alert("Error during bulk translation: " + err.message);
    }
    
    btn.innerHTML = originalHtml; btn.disabled = false;
};

// 4. Override Bulk Upload (Memory Cache + Batching)
window.bulkUploadPrayers = async function(e) {
    if(!confirm("Are you sure you want to sync all 600+ prayers to Firebase? This will consume database write operations.")) return;
    var btn = e.currentTarget;
    var originalHtml = btn.innerHTML;
    btn.innerHTML = 'Syncing...'; btn.disabled = true;
    try {
        var prayers = window.translatedPrayersCache || await SAC_DATABASE.get("catholic_prayers");
        if(!prayers || prayers.length === 0) { alert("No default prayers found to sync."); btn.innerHTML = originalHtml; btn.disabled = false; return; }
        
        var successCount = 0;
        var chunkSize = 250;
        for (var i = 0; i < prayers.length; i += chunkSize) {
            var chunk = prayers.slice(i, i + chunkSize);
            var batch = SAC_DATABASE.db.batch();
            chunk.forEach(function(p) {
                var id = p.id || ("catholic_prayers_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5));
                var dataToSave = JSON.parse(JSON.stringify(Object.assign({}, p, { id: id })));
                batch.set(SAC_DATABASE.db.collection("catholic_prayers").doc(id), dataToSave);
            });
            await batch.commit();
            successCount += chunk.length;
            btn.innerHTML = 'Syncing... (' + successCount + '/' + prayers.length + ')';
        }
        btn.innerHTML = 'Sync Complete!';
        if (typeof showGlobalSuccessAlert !== 'undefined') {
            showGlobalSuccessAlert("Successfully synced " + successCount + " prayers to Firebase!");
        } else {
            alert("Successfully synced " + successCount + " prayers to Firebase!");
        }
    } catch(err) { console.error("Bulk upload error:", err); alert("Error during sync: " + err.message); btn.innerHTML = originalHtml; btn.disabled = false; }
};

// 5. Populate Catholic Prayers List — uses the correct field names (titleTa/titleEn, contentTa/contentEn)


// 6. DOM modifications on page load
window.addEventListener('DOMContentLoaded', function() {
    // Add "Auto-Translate" button next to single English Content label
    var labels = document.querySelectorAll('label.form-label');
    labels.forEach(function(lbl) {
        if (lbl.innerText.indexOf('Prayer Content (English)') !== -1) {
            var wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'space-between';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginBottom = '8px';
            
            var newLbl = document.createElement('label');
            newLbl.className = 'form-label';
            newLbl.style.marginBottom = '0';
            newLbl.innerText = 'Prayer Content (English)';
            
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'cp-btn-translate';
            btn.className = 'btn-secondary';
            btn.style.padding = '2px 8px';
            btn.style.fontSize = '11px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.gap = '4px';
            btn.innerHTML = 'Auto-Translate <span class="material-icons" style="font-size:12px;">translate</span>';
            btn.onclick = window.autoTranslatePrayerToEnglish;
            
            wrapper.appendChild(newLbl);
            wrapper.appendChild(btn);
            
            lbl.parentNode.replaceChild(wrapper, lbl);
        } else if (lbl.innerText.indexOf('Prayer Title (English)') !== -1) {
            lbl.style.marginBottom = '8px';
            lbl.style.display = 'block';
        }
    });
});


// --- CATHOLIC PRAYERS CRUD OPERATIONS ---

window.resetCatholicPrayerForm = function() {
    var form = document.getElementById('form-crud-catholic-prayers');
    if (form) form.reset();
    document.getElementById('cp-id').value = '';
    
    var isTa = (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta');
    var titleEl = document.getElementById('cp-form-title');
    var btnEl = document.getElementById('cp-btn-submit-label');
    if (titleEl) titleEl.innerText = isTa ? 'செபம் சேர் / திருத்து' : 'Add / Edit Prayer';
    if (btnEl) btnEl.innerText = isTa ? 'செபம் சேர்' : 'Save Prayer';
    
    // Reset translation button text
    var btnTranslate = document.getElementById('cp-btn-translate');
    if (btnTranslate) {
        btnTranslate.innerHTML = 'Auto-Translate <span class="material-icons" style="font-size:12px;">translate</span>';
    }
};

window.saveCatholicPrayer = async function(e) {
    e.preventDefault();
    if (typeof validateAdminForm === 'function' && !validateAdminForm(e.target)) return;
    
    const id = document.getElementById('cp-id').value || ('cp_' + Date.now());
    
    // Also update local storage / memory cache
    let prayers = [];
    if (window.translatedPrayersCache) {
        prayers = window.translatedPrayersCache;
    } else {
        prayers = await SAC_DATABASE.get('catholic_prayers') || [];
    }
    
    // Preserve existing isActive visibility status if editing, else default to true
    let isActive = true;
    const existing = prayers.find(p => p.id === id);
    if (existing && existing.isActive !== undefined) {
        isActive = existing.isActive !== false && existing.isActive !== 'false';
    }

    const data = {
        id: id,
        category: document.getElementById('cp-category').value.trim(),
        titleEn: document.getElementById('cp-titleEn').value.trim(),
        titleTa: document.getElementById('cp-titleTa').value.trim(),
        contentEn: document.getElementById('cp-contentEn').value.trim(),
        contentTa: document.getElementById('cp-contentTa').value.trim(),
        isActive: isActive,
        updatedAt: new Date().toISOString()
    };
    
    const isTa = (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta');
    const btn = document.querySelector('#form-crud-catholic-prayers button[type="submit"]');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = 'Saving...'; btn.disabled = true;
    
    try {
        // Save using universal database layer (safely handles local & Firebase sync)
        await SAC_DATABASE.save('catholic_prayers', data);
        
        const existingIdx = prayers.findIndex(p => p.id === id);
        if (existingIdx >= 0) prayers[existingIdx] = data;
        else prayers.unshift(data);
        
        window.translatedPrayersCache = prayers;
        
        if (typeof showGlobalSuccessAlert !== 'undefined') {
            showGlobalSuccessAlert('Prayer saved successfully!', 'Prayer saved successfully!');
        } else {
            alert('Prayer saved successfully!');
        }
        
        resetCatholicPrayerForm();
        populateCatholicPrayersList();
    } catch (err) {
        console.error('Error saving prayer:', err);
        if (typeof showGlobalErrorAlert !== 'undefined') {
            showGlobalErrorAlert('Error saving prayer', 'Error saving prayer');
        } else {
            alert('Error saving prayer');
        }
    }
    
    btn.innerHTML = originalHtml; btn.disabled = false;
};

window.editCatholicPrayer = async function(id) {
    let prayers = window.translatedPrayersCache || await SAC_DATABASE.get('catholic_prayers') || [];
    const p = prayers.find(item => item.id === id);
    if (!p) return;
    
    document.getElementById('cp-id').value = p.id || '';
    document.getElementById('cp-category').value = p.category || p.source_category || '';
    document.getElementById('cp-titleEn').value = (p.titleEn && !/[\u0B80-\u0BFF]/.test(p.titleEn)) ? p.titleEn : '';
    document.getElementById('cp-titleTa').value = p.titleTa || p.title || '';
    document.getElementById('cp-contentEn').value = (p.contentEn && !/[\u0B80-\u0BFF]/.test(p.contentEn)) ? p.contentEn : '';
    document.getElementById('cp-contentTa').value = p.contentTa || p.content || '';
    
    var isTa = (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta');
    document.getElementById('cp-form-title').innerText = isTa ? 'செபத்தை திருத்து' : 'Edit Prayer';
    document.getElementById('cp-btn-submit-label').innerText = isTa ? 'மாற்றங்களைச் சேமி' : 'Update Prayer';
    
    // Scroll to form
    const formPanel = document.getElementById('panel-catholic_prayers');
    if (formPanel) formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.deleteCatholicPrayer = async function(id, title) {
    const msgEn = `Are you sure you want to delete "${title}"? This will remove it from the public page.`;
    const msgTa = `நிச்சயமாக "${title}" செபத்தை நீக்க விரும்புகிறீர்களா? இது இணையதள பக்கத்திலிருந்து நீக்கப்படும்.`;

    const performDelete = async () => {
        try {
            let prayers = window.translatedPrayersCache || await SAC_DATABASE.get('catholic_prayers') || [];
            const p = prayers.find(item => item.id === id);
            if (!p) return;
            
            // Soft delete: Mark isDeleted as true, and save using standard database layer
            p.isDeleted = true;
            await SAC_DATABASE.save('catholic_prayers', p);
            
            // Filter deleted item out from dynamic memory cache
            prayers = prayers.filter(item => item.id !== id);
            window.translatedPrayersCache = prayers;
            
            populateCatholicPrayersList();
            
            if (typeof showGlobalSuccessAlert !== 'undefined') {
                showGlobalSuccessAlert('செபம் நீக்கப்பட்டது', 'Prayer deleted successfully');
            }
        } catch (err) {
            console.error('Error deleting prayer:', err);
            alert('Failed to delete prayer.');
        }
    };

    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm(msgEn, msgTa, performDelete);
    } else {
        // Fallback to standard confirm if showCustomConfirm is not defined
        const isTa = (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta');
        if (confirm(isTa ? msgTa : msgEn)) {
            await performDelete();
        }
    }
};

async function translateTextSingleBrowserAdmin(text) {
    if (!text) return "";
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t";
    var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'q=' + encodeURIComponent(text)
    });
    if (!res.ok) throw new Error("Translation failed");
    var json = await res.json();
    var translated = "";
    if (json && json[0]) {
        json[0].forEach(function(t) { if (t[0]) translated += t[0]; });
    }
    return translated;
}

window.populateCatholicPrayersList = async function() {
    var listContainer = document.getElementById('admin-catholic-prayers-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">Loading prayers...</div>';
    
    try {
        var prayers = window.translatedPrayersCache || await SAC_DATABASE.get("catholic_prayers");
        if (prayers) {
            prayers = prayers.filter(p => p.isDeleted !== true && p.isDeleted !== 'true');
        }
        if (!prayers || prayers.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-secondary);"><span class="material-icons" style="font-size:40px; opacity:0.4;">menu_book</span><p style="margin:12px 0 4px 0; font-weight:600;">No Prayers Found</p><p style="margin:0; font-size:0.85rem;">Add a prayer using the form, or generate defaults.</p></div>';
            return;
        }
        
        var isTa = (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta');
        var html = '';
        
        for (var i = 0; i < prayers.length; i++) {
            var p = prayers[i];
            // Ensure ID exists (fallback for old default data that might not have IDs)
            if (!p.id) p.id = 'old_cp_' + i;
            
            var title = (isTa ? p.titleTa : p.titleEn) || p.titleTa || p.title || 'Untitled';
            var content = (isTa ? p.contentTa : p.contentEn) || p.contentTa || p.content || '';
            var category = p.category || p.source_category || 'General';
            var shortContent = content.length > 80 ? content.substring(0, 80) + '...' : content;
            
            // Clean escaped quotes for inline onclick
            var safeId = p.id.replace(/"/g, '&quot;');
            var safeTitle = title.replace(/"/g, '&quot;').replace(/'/g, '\'');
            
            var isActive = p.isActive !== false && p.isActive !== 'false';
            var eyeIcon = isActive ? 'visibility' : 'visibility_off';
            
            // Map liturgical badge class dynamically for rich aesthetics
            var badgeClass = 'liturgical-ordinary';
            var catLower = category.toLowerCase();
            if (catLower.includes('daily') || catLower.includes('அன்றாட')) {
                badgeClass = 'liturgical-lent';
            } else if (catLower.includes('healing') || catLower.includes('நலமளிக்க')) {
                badgeClass = 'liturgical-easter';
            } else if (catLower.includes('departed') || catLower.includes('இறந்தவ')) {
                badgeClass = 'liturgical-martyrs';
            } else if (catLower.includes('saints') || catLower.includes('புனிதர்')) {
                badgeClass = 'liturgical-marian';
            } else if (catLower.includes('family') || catLower.includes('குடும்ப')) {
                badgeClass = 'liturgical-ordinary';
            }
            
            html += `
                <div class="crud-item ${isActive === false ? 'inactive-item' : ''}" data-prayer-id="${safeId}">
                    <div class="crud-info">
                        <div class="crud-title">${title}</div>
                        <div class="crud-sub">
                            <span class="liturgical-badge ${badgeClass}" style="padding:2px 8px; font-size:0.65rem;">${category}</span>
                            <span style="display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;">
                                📖 ${shortContent}
                            </span>
                        </div>
                    </div>
                    <div class="crud-actions">
                        <button type="button" class="btn-crud-icon ${isActive === false ? 'inactive-toggle' : 'active-toggle'}" onclick="toggleCatholicPrayerActive('${safeId}')" title="${isActive ? 'Hide' : 'Show'}">
                            <span class="material-icons">${eyeIcon}</span>
                        </button>
                        <button type="button" class="btn-crud-icon" onclick="editCatholicPrayer('${safeId}')" title="Edit">
                            <span class="material-icons">edit</span>
                        </button>
                        <button type="button" class="btn-crud-icon btn-crud-delete" onclick="deleteCatholicPrayer('${safeId}', '${safeTitle}')" title="Delete">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            `;
            
            // Staggered background dynamic translation for admin list if in English mode and fields have Tamil
            if (!isTa) {
                var tamilRe = /[\u0B80-\u0BFF]/;
                var needsTitleTrans = !p.titleEn || tamilRe.test(p.titleEn);
                var needsContentTrans = !p.contentEn || tamilRe.test(p.contentEn);
                
                if (needsTitleTrans || needsContentTrans) {
                    (function(prayerItem, idx) {
                        setTimeout(async () => {
                            try {
                                if (typeof SAC_COMMON !== 'undefined' && SAC_COMMON.currentLang === 'ta') return;
                                
                                let updated = false;
                                if (needsTitleTrans) {
                                    const tText = await translateTextSingleBrowserAdmin(prayerItem.titleTa || prayerItem.title || "");
                                    if (tText) {
                                        prayerItem.titleEn = tText;
                                        updated = true;
                                    }
                                }
                                if (needsContentTrans) {
                                    const cText = await translateTextSingleBrowserAdmin(prayerItem.contentTa || prayerItem.content || "");
                                    if (cText) {
                                        prayerItem.contentEn = cText;
                                        updated = true;
                                    }
                                }
                                
                                if (updated) {
                                    const card = document.querySelector(`[data-prayer-id="${prayerItem.id}"]`);
                                    if (card) {
                                        if (prayerItem.titleEn) {
                                            const titleEl = card.querySelector('.crud-title');
                                            if (titleEl) titleEl.innerText = prayerItem.titleEn;
                                        }
                                        if (prayerItem.contentEn) {
                                            const subEl = card.querySelector('.crud-sub span:not(.liturgical-badge)');
                                            if (subEl) {
                                                const short = prayerItem.contentEn.length > 80 ? prayerItem.contentEn.substring(0, 80) + '...' : prayerItem.contentEn;
                                                subEl.innerText = '📖 ' + short;
                                            }
                                        }
                                    }
                                    window.translatedPrayersCache = prayers;
                                    try { localStorage.setItem('sac_catholic_prayers', JSON.stringify(prayers)); } catch(e){}
                                }
                            } catch(err) {
                                console.warn("Background admin translation failed for prayer:", prayerItem.id, err);
                            }
                        }, idx * 250);
                    })(p, i);
                }
            }
        }
        
        listContainer.innerHTML = html;
        
        // Dynamically inject total and inactive counts summary right below the header title
        var summaryEl = document.getElementById('cp-summary-badges');
        if (!summaryEl) {
            var titleParent = document.getElementById('cp-list-title');
            if (titleParent) {
                summaryEl = document.createElement('div');
                summaryEl.id = 'cp-summary-badges';
                summaryEl.style.display = 'flex';
                summaryEl.style.gap = '8px';
                summaryEl.style.marginTop = '4px';
                titleParent.parentNode.appendChild(summaryEl);
            }
        }
        if (summaryEl) {
            var totalLbl = isTa ? 'மொத்தம்: ' : 'Total: ';
            var inactiveLbl = isTa ? 'மறைக்கப்பட்டது: ' : 'Hidden: ';
            summaryEl.innerHTML = `
                <span class="liturgical-badge liturgical-ordinary" style="font-size:0.65rem; padding:2px 8px; font-weight:700;">${totalLbl}${prayers.length}</span>
                <span class="liturgical-badge liturgical-martyrs" style="font-size:0.65rem; padding:2px 8px; font-weight:700;">${inactiveLbl}${prayers.filter(p => p.isActive === false || p.isActive === 'false').length}</span>
            `;
        }
        
    } catch (error) {
        console.error("Error loading Catholic Prayers:", error);
        listContainer.innerHTML = '<div style="color:red; padding:20px;">Error loading prayers: ' + error.message + '</div>';
    }
};

window.toggleCatholicPrayerActive = async function(id) {
    try {
        let prayers = window.translatedPrayersCache || await SAC_DATABASE.get('catholic_prayers') || [];
        const idx = prayers.findIndex(item => item.id === id);
        if (idx === -1) return;
        
        // Toggle active state
        const currentActive = prayers[idx].isActive !== false && prayers[idx].isActive !== 'false';
        prayers[idx].isActive = !currentActive;
        
        // Save using universal database layer (safely handles local & Firebase sync)
        await SAC_DATABASE.save('catholic_prayers', prayers[idx]);
        
        window.translatedPrayersCache = prayers;
        
        populateCatholicPrayersList();
        
        if (typeof showGlobalSuccessAlert !== 'undefined') {
            showGlobalSuccessAlert('செபத்தின் பார்வை நிலை மாற்றப்பட்டது!', 'Visibility updated successfully!', true);
        }
    } catch (err) {
        console.error('Error toggling visibility:', err);
        alert('Failed to update visibility.');
    }
};



// ======================= GALLERY CRUD =======================

// Gallery source toggle
window.toggleGallerySource = function() {
    var isFile = document.querySelector('input[name="gallery-source-type"][value="file"]');
    if (!isFile) return;
    document.getElementById('gallery-url-section').style.display = isFile.checked ? 'none' : 'block';
    document.getElementById('gallery-file-section').style.display = isFile.checked ? 'block' : 'none';
    if (!isFile.checked) {
        window._galleryBase64 = '';
    }
};

window.handleGalleryFileUpload = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var w = img.width, h = img.height;
            var max = 800;
            if (w > max) { h = h * max / w; w = max; }
            if (h > max) { w = w * max / h; h = max; }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            window._galleryBase64 = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('gallery-file-status').innerText = 'Selected: ' + file.name;
            var preview = document.getElementById('gallery-preview-img');
            var box = document.getElementById('gallery-preview-box');
            if (preview && box) { preview.src = window._galleryBase64; box.style.display = 'block'; }
        };
        img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
};

window.populateGalleryList = async function() {
    var container = document.getElementById('admin-gallery-list');
    if (!container) return;
    try {
        var items = await SAC_DATABASE.get("gallery") || [];
        var isTa = window.SAC_COMMON ? SAC_COMMON.currentLang === 'ta' : false;
        
        if (items.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:#888;">புகைப்படங்கள் ஏதுமில்லை / No images found</div>';
            return;
        }
        
        var html = '';
        items.forEach(function(item) {
            var safeId = (item.id || '').replace(/'/g, "\\'");
            var safeTitle = ((isTa ? item.titleTa : item.titleEn) || 'Image').replace(/'/g, "\\'");
            var title = isTa ? (item.titleTa || item.titleEn) : (item.titleEn || item.titleTa);
            var cat = isTa ? (item.catTa || item.catEn) : (item.catEn || item.catTa);
            var isActive = item.isActive !== false;
            
            var opacityStyle = isActive ? '1' : '0.5';
            var eyeIcon = isActive ? 'visibility' : 'visibility_off';
            var eyeColor = isActive ? '#10b981' : '#94a3b8';
            
            html += `
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; opacity:${opacityStyle}; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="width:100%; height:100px; background:#f1f5f9; overflow:hidden;">
                        <img src="${item.src}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none';">
                    </div>
                    <div style="padding:10px 12px;">
                        <div style="font-size:0.65rem; color:#4f46e5; text-transform:uppercase; font-weight:800; letter-spacing:0.3px; margin-bottom:4px; background:#eef2ff; display:inline-block; padding:2px 8px; border-radius:20px;">${cat}</div>
                        <div style="font-size:0.82rem; color:#1e293b; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:8px;">${title}</div>
                        <div style="display:flex; gap:4px; justify-content:center;">
                            <button type="button" onclick="toggleGalleryActive('${safeId}')" title="${isActive ? 'Hide' : 'Show'}" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                                <span class="material-icons" style="color:${eyeColor}; font-size:16px;">${eyeIcon}</span>
                            </button>
                            <button type="button" onclick="editGalleryImage('${safeId}')" title="Edit" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                                <span class="material-icons" style="font-size:16px; color:#334155;">edit</span>
                            </button>
                            <button type="button" onclick="deleteGalleryImage('${safeId}', '${safeTitle}')" title="Delete" style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                                <span class="material-icons" style="color:#ef4444; font-size:16px;">delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color:red; text-align:center;">Error loading gallery images.</div>';
    }
};

window.saveGalleryImage = async function(e) {
    e.preventDefault();
    if (!validateAdminForm(e.target)) return;
    
    var id = document.getElementById('gallery-id').value || ('gallery_' + Date.now());
    var isNew = !document.getElementById('gallery-id').value;
    
    var isFileMode = document.querySelector('input[name="gallery-source-type"][value="file"]');
    var src = '';
    if (isFileMode && isFileMode.checked && window._galleryBase64) {
        src = window._galleryBase64;
    } else {
        src = document.getElementById('gallery-src').value.trim();
    }
    
    var data = {
        id: id,
        src: src,
        catEn: document.getElementById('gallery-catEn').value.trim(),
        catTa: document.getElementById('gallery-catTa').value.trim(),
        titleEn: document.getElementById('gallery-titleEn').value.trim(),
        titleTa: document.getElementById('gallery-titleTa').value.trim(),
        isActive: true
    };
    
    try {
        var items = await SAC_DATABASE.get("gallery") || [];
        if (!isNew) {
            var idx = items.findIndex(function(i) { return i.id === id; });
            if (idx !== -1) {
                // Keep isActive if editing
                data.isActive = items[idx].isActive !== false && items[idx].isActive !== 'false';
            }
        }
        
        await SAC_DATABASE.save("gallery", data);
        showGlobalSuccessAlert("புகைப்படம் சேமிக்கப்பட்டது!", "Image saved successfully!");
        resetGalleryForm();
        populateGalleryList();
    } catch (err) {
        console.error(err);
        showGlobalErrorAlert("பிழை!", "Error saving image.");
    }
};

window.editGalleryImage = async function(id) {
    try {
        var items = await SAC_DATABASE.get("gallery") || [];
        var item = items.find(function(i) { return i.id === id; });
        if (!item) return;
        
        document.getElementById('gallery-id').value = item.id;
        document.getElementById('gallery-src').value = item.src || '';
        document.getElementById('gallery-catEn').value = item.catEn || '';
        document.getElementById('gallery-catTa').value = item.catTa || '';
        document.getElementById('gallery-titleEn').value = item.titleEn || '';
        document.getElementById('gallery-titleTa').value = item.titleTa || '';
        
        document.getElementById('gallery-form-title').innerText = "புகைப்படம் திருத்து / Edit Image";
        // Show preview of current image
        var preview = document.getElementById('gallery-preview-img');
        var box = document.getElementById('gallery-preview-box');
        if (preview && box && item.src) { preview.src = item.src; box.style.display = 'block'; }
        const formPanel = document.getElementById('panel-gallery');
        if (formPanel) formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({top: 0, behavior: 'smooth'});
    } catch (e) { console.error(e); }
};

window.deleteGalleryImage = async function(id, title) {
    const msgEn = `Are you sure you want to delete "${title}"? This will remove it from the public gallery.`;
    const msgTa = `நிச்சயமாக "${title}" படத்தை நீக்க விரும்புகிறீர்களா? இது இணையதள பக்கத்திலிருந்து நீக்கப்படும்.`;

    const performDelete = async () => {
        try {
            await SAC_DATABASE.delete("gallery", id);
            showGlobalSuccessAlert("படம் நீக்கப்பட்டது!", "Image deleted!");
            populateGalleryList();
        } catch (e) {
            console.error(e);
            showGlobalErrorAlert("பிழை!", "Error deleting image.");
        }
    };

    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm(msgEn, msgTa, performDelete);
    } else {
        const isTa = (window.SAC_COMMON && SAC_COMMON.currentLang === 'ta');
        if (confirm(isTa ? msgTa : msgEn)) {
            await performDelete();
        }
    }
};

window.toggleGalleryActive = async function(id) {
    try {
        var items = await SAC_DATABASE.get("gallery") || [];
        var idx = items.findIndex(function(i) { return i.id === id; });
        if (idx !== -1) {
            items[idx].isActive = (items[idx].isActive === false || items[idx].isActive === 'false') ? true : false;
            await SAC_DATABASE.save("gallery", items[idx]);
            populateGalleryList();
            if (typeof showGlobalSuccessAlert !== 'undefined') {
                showGlobalSuccessAlert("பார்வை நிலை மாற்றப்பட்டது!", "Image visibility toggled!", true);
            }
        }
    } catch (e) { console.error(e); }
};

window.resetGalleryForm = function() {
    document.getElementById('form-crud-gallery').reset();
    document.getElementById('gallery-id').value = '';
    document.getElementById('gallery-form-title').innerText = "புகைப்படம் சேர் / Add Image";
    window._galleryBase64 = '';
    var preview = document.getElementById('gallery-preview-box');
    if (preview) preview.style.display = 'none';
    var fileStatus = document.getElementById('gallery-file-status');
    if (fileStatus) fileStatus.innerText = 'Click or drag an image here';
    var urlSection = document.getElementById('gallery-url-section');
    var fileSection = document.getElementById('gallery-file-section');
    if (urlSection) urlSection.style.display = 'block';
    if (fileSection) fileSection.style.display = 'none';
    
    // Remove validation styles
    var form = document.getElementById('form-crud-gallery');
    form.querySelectorAll('.sac-validation-error').forEach(function(el) { el.remove(); });
    form.querySelectorAll('.form-control').forEach(function(el) { el.style.borderColor = ''; });
};

// Hook into initial load to populate
const originalPopulateDataForTabsGallery = window.populateDataForTabs;
window.populateDataForTabs = async function() {
    if(originalPopulateDataForTabsGallery) await originalPopulateDataForTabsGallery();
    await populateGalleryList();
};
