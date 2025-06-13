// Import the functions you need from the SDKs you need
import '@expo/metro-runtime';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEzQivS--A-RE_wq51w8wREEQKPJFpwQM",
  authDomain: "micomidafavorita-dfac2.firebaseapp.com",
  projectId: "micomidafavorita-dfac2",
  storageBucket: "micomidafavorita-dfac2.firebasestorage.app",
  messagingSenderId: "59289159526",
  appId: "1:59289159526:web:8b1382944be659e56beaa7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);