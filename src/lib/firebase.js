import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:  "AIzaSyDJl-SZelbrUbRkZXkOtvtnfNjGBDjt6MI",
  authDomain: "yahin-ed6d9.firebaseapp.com",
  projectId: "yahin-ed6d9",
  storageBucket: "yahin-ed6d9.firebasestorage.app",
  messagingSenderId: "278365702103",
  appId: "1:278365702103:web:6fb38af773d1ea5203ed92",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);