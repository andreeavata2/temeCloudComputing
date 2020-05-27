import 'firebase/messaging';

import firebaseApp from './Utils/configFirebase';

const messaging = firebaseApp.messaging();

messaging.usePublicVapidKey(
  'BMcgPu0cVKqY1lMo8LLJYc6QVbwtjUy-zBNRtzABxBJO_oCYbpvV9Q2-RFEBxODQQ3UXOCxXPqUjU8haLD0isGo'
);

export { messaging };
