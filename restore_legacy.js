const fs = require('fs');

const htmlPath = 'd:\\SAC Website\\legacy.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The mangled block:
const badBlock = `    <script src="js/common.js"></script>

    <script>

            window.addEventListener('sacDataRefreshed', async (e) => {
                if (e.detail && e.detail.collection === 'legacy_timeline') {`;

const goodBlock = `    <script src="js/common.js"></script>

    <script>
        // Init page
        window.addEventListener('DOMContentLoaded', async () => {
            await SAC_COMMON.init('legacy');
            applyLegacyIconFallback();
            
            await loadTimelineEvents();
            await loadPastOfficials();
            initPannellumViewer();

            // Reveal the finished page frame
            SAC_COMMON.revealPage();

            window.addEventListener('sacLanguageChanged', async () => {
                await loadTimelineEvents();
                await loadPastOfficials();
            });

            window.addEventListener('sacDataRefreshed', async (e) => {
                if (e.detail && e.detail.collection === 'legacy_timeline') {`;

if (html.includes(badBlock)) {
    html = html.replace(badBlock, goodBlock);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log("Restored DOMContentLoaded and added initPannellumViewer()");
} else {
    console.log("Could not find the bad block. Needs manual check.");
}
