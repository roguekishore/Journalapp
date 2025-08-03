import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzH7QsBM75aX6ZfBWPF2XQxb3nj058PjA",
  authDomain: "journal-app-369.firebaseapp.com",
  projectId: "journal-app-369",
  storageBucket: "journal-app-369.firebasestorage.app",
  messagingSenderId: "64785794166",
  appId: "1:64785794166:web:9daef5658f0f5a25210b57",
  measurementId: "G-CVQF53CPB4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'unimplemented') {
      console.log("Persistence is not available in this environment.");
    } else if (err.code === 'failed-precondition') {
      console.log("Multiple tabs open. Persistence may not work.");
    } else {
      console.error("Error enabling persistence:", err);
    }
  });