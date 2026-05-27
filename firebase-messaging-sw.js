importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

// --- LIVE Firebase Configuration ---
// Hardcoded here because service workers cannot access localStorage.
// This MUST match the credentials in js/database.js defaultData.firebase_config.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD2PpMl6jeHehj6GlNS5B1Uni6pos7UkJc",
  authDomain: "stacpaganur.firebaseapp.com",
  projectId: "stacpaganur",
  storageBucket: "stacpaganur.firebasestorage.app",
  messagingSenderId: "495839870905",
  appId: "1:495839870905:web:f9f8ab0446292689a50068"
};

// Initialize Firebase immediately so background messages work without
// requiring a message from the main thread first.
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const messaging = firebase.messaging();

// Handle background (push) messages when the app is NOT in the foreground
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification?.title || 'St. Antony\'s Church';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new parish notification.',
    icon: '/images/church_logo.jpg',
    badge: '/images/church_logo.jpg',
    tag: 'sac-notification',
    renotify: true,
    data: { url: payload.data?.url || '/' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Open the site when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// Accept config updates from main thread to stay in sync (e.g., if admin changes project)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    console.log('[firebase-messaging-sw.js] Config update received from main thread — already initialized, skipping re-init.');
  }
});
