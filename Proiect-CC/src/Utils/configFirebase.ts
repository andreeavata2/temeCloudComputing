import * as firebase from 'firebase';
const config = {
  apiKey: "AIzaSyAl-J-hv2i4zmTjA2ElLjkaKTkH3L_91h8",
  authDomain: "cloudc5.firebaseapp.com",
  databaseURL: "https://cloudc5.firebaseio.com",
  projectId: "cloudc5",
  storageBucket: "cloudc5.appspot.com",
  messagingSenderId: "569608633901",
  appId: "1:569608633901:web:d09270e6278161e34482a4",
  measurementId: "G-2LCP3KJ80Y"
};
const firebaseApp = firebase.initializeApp(config);
export default firebaseApp;
