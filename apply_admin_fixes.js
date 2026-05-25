const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'sac-admin-portal.html');
let html = fs.readFileSync(adminPath, 'utf8');

// 1. Fix Translation for Past Officials
html = html.replace(
    /document\.getElementById\('tab-lbl-timeline'\)\.innerText = isTa \? "வரலாறு \(CRUD\)" : "History \(CRUD\)";/,
    `document.getElementById('tab-lbl-timeline').innerText = isTa ? "வரலாறு (CRUD)" : "History (CRUD)";\n            document.getElementById('tab-lbl-past-officials').innerText = isTa ? "முன்னாள் பொறுப்பாளர்கள்" : "Past Officials";`
);

// 2. Remove 'required' from po-periodEn and po-periodTa
html = html.replace(
    /<input type="text" id="po-periodEn" class="form-control" required>/,
    '<input type="text" id="po-periodEn" class="form-control">'
);
html = html.replace(
    /<input type="text" id="po-periodTa" class="form-control" required>/,
    '<input type="text" id="po-periodTa" class="form-control">'
);

// 3. Add novalidate to all forms
html = html.replace(/<form /g, '<form novalidate ');

// 4. Inject validateAdminForm
const validationJs = `
        // ======================= GLOBAL FORM VALIDATION =======================
        function validateAdminForm(form) {
            let isValid = true;
            const isTa = window.SAC_COMMON ? SAC_COMMON.currentLang === 'ta' : false;
            
            form.querySelectorAll('.sac-validation-error').forEach(el => el.remove());
            
            const requiredInputs = form.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'sac-validation-error';
                    errorMsg.innerText = isTa ? 'இப்புலம் கட்டாயம் நிரப்பப்பட வேண்டும்.' : 'This field is required.';
                    errorMsg.style.display = 'block';
                    
                    let targetContainer = input.parentNode;
                    if (targetContainer.classList.contains('password-wrapper')) {
                        targetContainer = targetContainer.parentNode;
                    }
                    
                    targetContainer.style.position = 'relative';
                    targetContainer.style.paddingBottom = '24px';
                    targetContainer.appendChild(errorMsg);
                    
                    input.style.borderColor = '#e11d48';
                    
                    input.addEventListener('input', function onInput() {
                        input.style.borderColor = '';
                        targetContainer.style.paddingBottom = '';
                        if (errorMsg.parentNode) errorMsg.remove();
                        input.removeEventListener('input', onInput);
                    });
                }
            });
            return isValid;
        }
`;

html = html.replace('// ======================= TAB 1: SETTINGS FUNCTIONS =======================', validationJs + '\n        // ======================= TAB 1: SETTINGS FUNCTIONS =======================');

// 5. Add validation hook to all save functions AND handleAdminLogin
const funcs = [
    'saveGeneralSettings', 'saveMassSchedule', 'saveNotice', 
    'saveTimelineEvent', 'saveGalleryImage', 'savePastOfficial', 
    'saveDatabaseConfig'
];

funcs.forEach(func => {
    // These are async functions
    const regex = new RegExp(`(async function ${func}\\(e\\) \\{\\s*e\\.preventDefault\\(\\);)`);
    html = html.replace(regex, '$1\n            if (!validateAdminForm(e.target)) return;');
});

// handleAdminLogin is sync
html = html.replace(
    /(function handleAdminLogin\(e\) \{\s*e\.preventDefault\(\);)/,
    '$1\n            if (!validateAdminForm(e.target)) return;'
);

// 6. Ensure cache-busters are still there (optional but helpful)
html = html.replace('<script src="js/database.js"></script>', '<script src="js/database.js?v=2"></script>');

fs.writeFileSync(adminPath, html);
console.log('Admin portal updated successfully.');
