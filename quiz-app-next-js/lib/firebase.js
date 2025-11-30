// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgMjMrvmqRB4f4GRIC2cffkiKJefINq1E",
  authDomain: "quiz-app-next-js.firebaseapp.com",
  projectId: "quiz-app-next-js",
  storageBucket: "quiz-app-next-js.firebasestorage.app",
  messagingSenderId: "1080779620948",
  appId: "1:1080779620948:web:29b1dffcfbd582983323c1",
  measurementId: "G-944GP4NG01",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
