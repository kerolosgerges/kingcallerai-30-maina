
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCH10czwgNrhIzYRGAG1NdcIoAh-2Dgj28",
  authDomain: "king-caller-ai.firebaseapp.com",
  databaseURL: "https://king-caller-ai-default-rtdb.firebaseio.com",
  projectId: "king-caller-ai",
  storageBucket: "king-caller-ai.firebasestorage.app",
  messagingSenderId: "154013243763",
  appId: "1:154013243763:web:01007e5015ad803bfe8d06",
  measurementId: "G-9NCNNTXCDH"
};
// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
