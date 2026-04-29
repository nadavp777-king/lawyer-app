import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBbkc9rbP_rShqRO1f0szUnpv7WBR1Azs",
  authDomain: "lawyer-finder-7965b.firebaseapp.com",
  projectId: "lawyer-finder-7965b",
  storageBucket: "lawyer-finder-7965b.firebasestorage.app",
  messagingSenderId: "311972855654",
  appId: "1:311972855654:web:28e8a41e0a17332dbed2a7",
  measurementId: "G-DBMEGQ9FCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
