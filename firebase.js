import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDLth1VFSEQySg7nzsUwm6BTpGi4spwL74",
  authDomain: "fir-fef66.firebaseapp.com",
  projectId: "fir-fef66",
  storageBucket: "fir-fef66.appspot.com",
  messagingSenderId: "949501501808",
  appId: "1:949501501808:web:72ca34d1fc7ca27117efb5",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
export default db;
