/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

// eslint-disable-next-line no-undef
firebase.initializeApp({
  messagingSenderId: "1062407524656"
});

// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      // console.log("payload:",payload)
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: 'https://cdn5.vectorstock.com/i/1000x1000/38/59/infinity-or-infinite-loop-line-icon-vector-22893859.jpg'
      };
      self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        clients.openWindow(payload.data.link);
      });
      return registration.showNotification(notificationTitle,
        notificationOptions);
        
    });
  return promiseChain;
});
