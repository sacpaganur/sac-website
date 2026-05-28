/* Firebase Cloud Messaging (FCM) Integration */

const SAC_MESSAGING = {
  messaging: null,

  async init() {
    if (!SAC_DATABASE.isFirebaseActive || !window.firebase) {
      console.log("Firebase is not active. Push notifications disabled.");
      return;
    }

    try {
      this.messaging = firebase.messaging();
      
      // Send config to service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (registration.active) {
             const config = SAC_DATABASE.getCollection("sac_firebase_config");
             registration.active.postMessage({ type: 'FIREBASE_CONFIG', config });
          }
        });
      }

      // Handle foreground messages
      this.messaging.onMessage((payload) => {
        console.log("Message received in foreground: ", payload);
        this.showForegroundNotification(payload);
      });

      // Check if we already have permission or need to show the prompt
      this.checkPermissionStatus();
    } catch (err) {
      console.warn("FCM Initialization failed:", err);
    }
  },

  async requestPermission() {
    const isTa = SAC_COMMON.currentLang === 'ta';
    if (!('Notification' in window)) {
      const errMsg = isTa
        ? "உங்கள் உலாவி புஷ் அறிவிப்புகளை ஆதரிக்கவில்லை. தயவுசெய்து இந்த செயலியை முகப்புத் திரையில் நிறுவி (Add to Home Screen) அங்கிருந்து திறக்கவும்."
        : "Your browser does not support push notifications. If you are on iOS, please install the app to your Home Screen first.";
      this.showErrorToast(errMsg);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log("Notification permission granted.");
        await this.subscribeToken();
      } else {
        console.log("Notification permission denied.");
        const errMsg = isTa
          ? "அறிவிப்பு அனுமதி மறுக்கப்பட்டது! அதை இயக்க, முகவரிப் பட்டியில் உள்ள பூட்டு (Lock 🔒) ஐகானைக் கிளிக் செய்து, அறிவிப்புகளை 'Allow' என மாற்றவும்."
          : "Notification permission blocked! To enable, click the Lock 🔒 icon next to the website address in your URL bar and change Notifications to 'Allow'.";
        this.showErrorToast(errMsg);
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  },

  async subscribeToken(isSilent = false) {
    if (!this.messaging) return;
    try {
      const config = SAC_DATABASE.getCollection("sac_firebase_config");
      const tokenOptions = {};
      const isTa = SAC_COMMON.currentLang === 'ta';
      
      if (config && config.vapidKey && config.vapidKey !== "YOUR_PUBLIC_VAPID_KEY_HERE" && config.vapidKey.trim() !== "") {
        tokenOptions.vapidKey = config.vapidKey.trim();
      } else {
        const warningMsg = isTa 
          ? "புஷ் அறிவிப்புகள் இன்னும் முழுமையாக கட்டமைக்கப்படவில்லை. தயவுசெய்து நிர்வாகி பலகையில் VAPID விசையை உள்ளிடவும்."
          : "Notification VAPID Key is not configured yet. Please generate Web Push Certificates in the Firebase Console and configure the VAPID Key in the Admin Portal.";
        if (!isSilent) this.showErrorToast(warningMsg);
        return;
      }

      // Get FCM token
      const currentToken = await this.messaging.getToken(tokenOptions);

      if (currentToken) {
        console.log("FCM Token obtained.");
        await this.saveTokenToDB(currentToken);
        if (!isSilent) {
          this.hidePrompt();
          this.showConfirmationToast();
        }
      } else {
        const errorMsg = isTa
          ? "பதிவு டோக்கன் கிடைக்கவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
          : "No registration token available. Please try again.";
        if (!isSilent) this.showErrorToast(errorMsg);
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
      const isTa = SAC_COMMON.currentLang === 'ta';
      const errorMsg = isTa
        ? "டோக்கனைப் பெறுவதில் பிழை ஏற்பட்டது. தயவுசெய்து உங்கள் ஃபயர்பேஸ் அமைப்புகளைச் சரிபார்க்கவும்."
        : "Failed to retrieve subscription token. Please verify your Firebase/VAPID configurations in the Admin Portal.";
      if (!isSilent) this.showErrorToast(errorMsg);
    }
  },

  async saveTokenToDB(token) {
    if (!SAC_DATABASE.db) return;
    try {
      // Save to sac_subscribers collection
      const docRef = SAC_DATABASE.db.collection('sac_subscribers').doc(token);
      await docRef.set({
        token: token,
        subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent
      }, { merge: true });
      console.log("Token saved to database.");
    } catch (err) {
      console.error("Error saving token to DB:", err);
    }
  },

  checkPermissionStatus() {
    if (!('Notification' in window)) {
      console.warn("This browser does not support push notifications.");
      return;
    }
    if (Notification.permission === 'default') {
      // Show custom prompt
      this.showPrompt();
    } else if (Notification.permission === 'granted') {
      this.subscribeToken(true);
    }
  },

  showPrompt() {
    // Inject a beautiful banner at the top or bottom asking for permission
    if (document.getElementById('sac-push-prompt')) return;

    const isTa = SAC_COMMON.currentLang === 'ta';
    const msg = isTa ? "முக்கிய ஆலய அறிவிப்புகளை உடனுக்குடன் பெற அனுமதியுங்கள்." : "Enable notifications to receive instant parish updates.";
    const btnAccept = isTa ? "அனுமதி" : "Enable";
    const btnDecline = isTa ? "வேண்டாம்" : "Not Now";

    const promptHtml = `
      <div id="sac-push-prompt" style="position:fixed; bottom:20px; left:20px; right:20px; max-width:400px; background:#fff; padding:20px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.1); z-index:9999; display:flex; flex-direction:column; gap:12px; border-left:4px solid var(--primary); animation: slideUp 0.5s ease;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="material-icons" style="color:var(--primary); font-size:24px;">notifications_active</span>
          <h4 style="margin:0; font-size:1rem; color:#333;">${isTa ? 'அறிவிப்புகள்' : 'Stay Updated'}</h4>
        </div>
        <p style="margin:0; font-size:0.9rem; color:#666; line-height:1.4;">${msg}</p>
        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:8px;">
          <button onclick="SAC_MESSAGING.hidePrompt()" style="background:none; border:none; color:#888; cursor:pointer; font-weight:600; padding:8px 16px;">${btnDecline}</button>
          <button onclick="SAC_MESSAGING.requestPermission()" style="background:var(--primary); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; padding:8px 16px; box-shadow:0 4px 10px rgba(139, 92, 246, 0.3);">${btnAccept}</button>
        </div>
      </div>
      <style>
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', promptHtml);
  },

  hidePrompt() {
    const prompt = document.getElementById('sac-push-prompt');
    if (prompt) {
      prompt.style.opacity = '0';
      prompt.style.transform = 'translateY(100px)';
      setTimeout(() => prompt.remove(), 300);
    }
  },

  showForegroundNotification(payload) {
    // Show a custom toast/snackbar for foreground messages
    const title = payload.notification?.title || "New Message";
    const body = payload.notification?.body || "";
    
    const toastHtml = `
      <div class="sac-toast-notification" style="position:fixed; top:20px; right:20px; max-width:350px; background:#fff; padding:16px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15); z-index:10000; display:flex; align-items:flex-start; gap:12px; border-left:4px solid var(--primary); animation: slideInRight 0.4s ease;">
        <span class="material-icons" style="color:var(--primary); font-size:24px;">church</span>
        <div>
          <h4 style="margin:0 0 4px 0; font-size:0.95rem; color:#222;">${title}</h4>
          <p style="margin:0; font-size:0.85rem; color:#555; line-height:1.4;">${body}</p>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#999; cursor:pointer; padding:0; align-self:flex-start;"><span class="material-icons" style="font-size:18px;">close</span></button>
      </div>
      <style>
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => {
      const toasts = document.querySelectorAll('.sac-toast-notification');
      if (toasts.length > 0) toasts[toasts.length - 1].remove();
    }, 5000);
  },

  showConfirmationToast() {
    const isTa = SAC_COMMON.currentLang === 'ta';
    const title = isTa ? "வெற்றி!" : "Subscription Active!";
    const msg = isTa ? "முக்கிய ஆலய அறிவிப்புகளைப் பெற வெற்றிகரமாக இணைந்துள்ளீர்கள்." : "You are now successfully subscribed to instant parish updates.";
    
    const toastHtml = `
      <div class="sac-toast-notification" style="position:fixed; top:20px; right:20px; max-width:350px; background:#fff; padding:16px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15); z-index:10000; display:flex; align-items:flex-start; gap:12px; border-left:4px solid #10B981; animation: slideInRight 0.4s ease;">
        <span class="material-icons" style="color:#10B981; font-size:24px;">check_circle</span>
        <div>
          <h4 style="margin:0 0 4px 0; font-size:0.95rem; color:#222;">${title}</h4>
          <p style="margin:0; font-size:0.85rem; color:#555; line-height:1.4;">${msg}</p>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#999; cursor:pointer; padding:0; align-self:flex-start;"><span class="material-icons" style="font-size:18px;">close</span></button>
      </div>
      <style>
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => {
      const toasts = document.querySelectorAll('.sac-toast-notification');
      toasts.forEach(t => {
        if (t.innerText.includes(title)) t.remove();
      });
    }, 5000);
  },

  showErrorToast(msgText) {
    const isTa = SAC_COMMON.currentLang === 'ta';
    const title = isTa ? "முக்கிய அறிவிப்பு" : "Action Required";
    
    const toastHtml = `
      <div class="sac-toast-notification" style="position:fixed; top:20px; right:20px; max-width:350px; background:#fff; padding:16px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15); z-index:10000; display:flex; align-items:flex-start; gap:12px; border-left:4px solid #EF4444; animation: slideInRight 0.4s ease;">
        <span class="material-icons" style="color:#EF4444; font-size:24px;">warning</span>
        <div>
          <h4 style="margin:0 0 4px 0; font-size:0.95rem; color:#222;">${title}</h4>
          <p style="margin:0; font-size:0.85rem; color:#555; line-height:1.4;">${msgText}</p>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#999; cursor:pointer; padding:0; align-self:flex-start;"><span class="material-icons" style="font-size:18px;">close</span></button>
      </div>
      <style>
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    setTimeout(() => {
      const toasts = document.querySelectorAll('.sac-toast-notification');
      toasts.forEach(t => {
        if (t.innerText.includes(title)) t.remove();
      });
    }, 6000);
  }
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      SAC_MESSAGING.init();
    }, 2000);
  });
} else {
  setTimeout(() => {
    SAC_MESSAGING.init();
  }, 1000);
}
