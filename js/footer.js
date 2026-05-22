/**
 * Shared enhanced site footer — injected once per page into #global-footer
 */
window.SAC_FOOTER = {
  inject() {
    const mount = document.getElementById('global-footer');
    if (!mount || mount.dataset.sacEnhanced === 'true') return;
    mount.outerHTML = this.markup;
    this.bindBackToTop();
  },

  bindBackToTop() {
    document.querySelectorAll('.footer-back-top, #sac-back-to-top').forEach((el) => {
      if (el.dataset.sacBound === 'true') return;
      el.dataset.sacBound = 'true';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('page-top') || document.documentElement;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    });
  },

  markup: `
<footer class="footer footer--enhanced" id="global-footer" data-sac-enhanced="true">
  <div class="footer-accent" aria-hidden="true"></div>
  <div class="footer-glow footer-glow--1" aria-hidden="true"></div>
  <div class="footer-glow footer-glow--2" aria-hidden="true"></div>

  <div class="footer-container">
    <div class="footer-brand">
      <div class="footer-brand-head">
        <span class="footer-church-logo" aria-hidden="true">⛪</span>
        <div class="footer-brand-titles">
          <h3>புனித அந்தோணியார் ஆலயம்</h3>
          <span class="footer-location">வடக்கு பாகனூர்</span>
        </div>
      </div>
      <p class="footer-tagline" data-i18n="footer.tagline">அமைதியும் அருள்மரியும் பெருகும் புண்ணியத்தலம்</p>
      <p class="footer-address-label"></p>
      <div class="footer-contact-row">
        <a href="#" class="footer-contact-chip" id="footer-phone-link">
          <span class="material-icons" aria-hidden="true">phone</span>
          <span id="footer-phone-text"></span>
        </a>
        <a href="#" class="footer-contact-chip" id="footer-email-link">
          <span class="material-icons" aria-hidden="true">mail</span>
          <span id="footer-email-text"></span>
        </a>
      </div>
    </div>

    <div class="footer-columns">
      <div class="footer-col">
        <h4 class="footer-col-title" data-i18n="footer.navigate">வழிசெலுத்தல்</h4>
        <ul class="footer-links">
          <li><a href="index.html" data-i18n="nav.home">முகப்பு</a></li>
          <li><a href="schedule.html" data-i18n="nav.schedule">வழிபாடுகள்</a></li>
          <li><a href="legacy.html" data-i18n="nav.legacy">வரலாறு</a></li>
          <li><a href="gallery.html" data-i18n="nav.gallery">புகைப்படங்கள்</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title" data-i18n="footer.parish">பங்கு &amp; வளங்கள்</h4>
        <ul class="footer-links">
          <li><a href="notices.html" data-i18n="nav.notices">அறிவிப்புகள்</a></li>
          <li><a href="contact.html" data-i18n="nav.contact">தொடர்பு</a></li>
          <li><a href="schedule.html" data-i18n="footer.massTimes">திருப்பலி நேரங்கள்</a></li>
        </ul>
      </div>
      <div class="footer-col footer-col--cta">
        <h4 class="footer-col-title" data-i18n="footer.visit">ஆலயத்தை வருகை</h4>
        <p class="footer-visit-lead" data-i18n="footer.visitLead">வழிபாட்டு நேரங்கள், செப விண்ணப்பங்கள் மற்றும் பங்கு சேவைகளுக்கு எங்களைத் தொடர்பு கொள்ளுங்கள்.</p>
        <div class="footer-cta-row">
          <a href="contact.html" class="footer-cta-btn" data-i18n="footer.contactBtn">தொடர்பு கொள்ளுங்கள்</a>
          <a href="schedule.html" class="footer-cta-btn footer-cta-btn--ghost" data-i18n="footer.scheduleBtn">அட்டவணை</a>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-copyright">
    <div class="footer-copyright-inner">
      <p class="footer-copy-text">
        &copy; <span id="footer-year">2026</span>
        <span id="footer-church-name-copyright">புனித அந்தோணியார் ஆலயம், வடக்கு பாகனூர்</span>.
        <span data-i18n="footer.copyText">அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</span>
      </p>
      <button type="button" class="footer-back-top" id="sac-back-to-top" aria-label="Back to top">
        <span class="material-icons" aria-hidden="true">keyboard_arrow_up</span>
        <span data-i18n="footer.backTop">மேலே</span>
      </button>
    </div>
  </div>
</footer>
`.trim()
};
