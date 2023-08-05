// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVB_kIDAolxJiI96o5HD0Q5xNrrp7h-JQ",
  authDomain: "chat-application-89815.firebaseapp.com",
  projectId: "chat-application-89815",
  storageBucket: "chat-application-89815.appspot.com",
  messagingSenderId: "656622899868",
  appId: "1:656622899868:web:42e13cd17e3cb51501d359",
  measurementId: "G-FN88XPE928"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
