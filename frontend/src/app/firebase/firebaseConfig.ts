'use client';

import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Ensure Firestore is imported
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCmC8-QRAFdQrKX0MR1xVEiPw0o33dUu3I",
  authDomain: "hitmeup-b23ac.firebaseapp.com",
  projectId: "hitmeup-b23ac",
  storageBucket: "hitmeup-b23ac.firebasestorage.app",
  messagingSenderId: "487887139598",
  appId: "1:487887139598:web:38ba5ddcabfdc833651d5f",
  measurementId: "G-6HXDZNDPKQ",
};

let app: FirebaseApp;
try {
  app = getApp(); 
} catch (error) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app); 
const firestore = getFirestore (app);
const storage = getStorage(app); 

console.log("Firestore initialized:", db);

export { app,firestore, auth, db, storage };
