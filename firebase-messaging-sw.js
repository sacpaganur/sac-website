importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

// We need a placeholder initialization here. 
// Firebase will try to auto-initialize if the config is available, but usually, 
// the service worker needs the config to receive background messages properly.
// Since the config is stored in localStorage dynamically by the Admin, the service worker doesn't have direct access.
// However, Firebase Messaging can often work if the Sender ID is provided, or the messaging token is registered in the main thread.
// To make this robust, we wait for a message from the main thread containing the config.

let messaging = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    if (!firebase.apps.length) {
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();
      
      // Handle background messages
      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        const notificationTitle = payload.notification?.title || 'SAC Notification';
        const notificationOptions = {
          body: payload.notification?.body,
          icon: '/images/church_logo.jpg',
          badge: '/images/church_logo.jpg'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    }
  }
});
