// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-27b4e.firebaseapp.com",
  projectId: "mern-estate-27b4e",
  storageBucket: "mern-estate-27b4e.appspot.com",
  messagingSenderId: "598509589164",
  appId: "1:598509589164:web:9053f16c5e4b8fab520509"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);