import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCnRHn2Q9qIzAER8NK-bTI6xiMqtbME-XA",
  authDomain: "vollyball-ad4ce.firebaseapp.com",
  projectId: "vollyball-ad4ce",
  storageBucket: "vollyball-ad4ce.firebasestorage.app",
  messagingSenderId: "306423290389",
  appId: "1:306423290389:web:9615712510919c5ebc8c1c",
  measurementId: "G-04456F9K1M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
