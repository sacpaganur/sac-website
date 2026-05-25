const fs = require('fs');
const path = require('path');

const adminPortalPath = path.join(__dirname, 'sac-admin-portal.html');
const stylePath = path.join(__dirname, 'css', 'style.css');

// 1. UPDATE CSS
let styleCss = fs.readFileSync(stylePath, 'utf8');
if (!styleCss.includes('.sac-validation-error')) {
    const cssToAdd = `
/* --- Admin Portal Inline Form Validation --- */
.form-group {
    position: relative;
    padding-bottom: 24px;
}
.sac-validation-error {
    color: #e11d48;
    font-size: 0.8rem;
    position: absolute;
    bottom: 0;
    left: 0;
    display: none;
    font-weight: 500;
}
`;
    styleCss += cssToAdd;
    fs.writeFileSync(stylePath, styleCss);
    console.log('Added CSS to style.css');
}

// 2. UPDATE HTML FORMS and INJECT JS
let html = fs.readFileSync(adminPortalPath, 'utf8');

// A. Add novalidate to all forms
html = html.replace(/<form /g, '<form novalidate ');

// B. Inject validateAdminForm function
const validateJs = `
        // ======================= GLOBAL FORM VALIDATION =======================
        function validateAdminForm(form) {
            let isValid = true;
            const isTa = window.SAC_COMMON ? SAC_COMMON.currentLang === 'ta' : false;
            
            // Clear previous errors
            form.querySelectorAll('.sac-validation-error').forEach(el => el.remove());
            
            const requiredInputs = form.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'sac-validation-error';
                    errorMsg.innerText = isTa ? 'இப்புலம் கட்டாயம் நிரப்பப்பட வேண்டும்.' : 'This field is required.';
                    errorMsg.style.display = 'block';
                    
                    // Wrap input's parent in form-group if not already, though easier is just to insert it after
                    input.parentNode.style.position = 'relative';
                    input.parentNode.style.paddingBottom = '24px';
                    
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    input.style.borderColor = '#e11d48';
                    
                    // Remove error on input
                    input.addEventListener('input', function onInput() {
                        input.style.borderColor = '';
                        input.parentNode.style.paddingBottom = '';
                        if (errorMsg.parentNode) errorMsg.remove();
                        input.removeEventListener('input', onInput);
                    });
                }
            });
            return isValid;
        }
`;

if (!html.includes('validateAdminForm(form)')) {
    html = html.replace('// ======================= TAB 1: SETTINGS FUNCTIONS =======================', validateJs + '\n        // ======================= TAB 1: SETTINGS FUNCTIONS =======================');
}

// C. Update save functions to call validateAdminForm
const saveFunctions = [
    'saveGeneralSettings',
    'saveMassSchedule',
    'saveNotice',
    'saveTimelineEvent',
    'saveGalleryImage',
    'savePastOfficial',
    'saveDatabaseConfig'
];

saveFunctions.forEach(func => {
    const regex = new RegExp("(async function " + func + "\\(e\\) \\{\\s*e\\.preventDefault\\(\\);)");
    html = html.replace(regex, '$1\n            if (!validateAdminForm(e.target)) return;');
});

fs.writeFileSync(adminPortalPath, html);
console.log('Successfully refactored sac-admin-portal.html');
