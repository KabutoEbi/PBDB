// Firebase初期化とエクスポート
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAP5XBlc28jDMI6rF_mAlcmAPA_9uYCX00",
  authDomain: "pbdb-f3227.firebaseapp.com",
  projectId: "pbdb-f3227",
  storageBucket: "pbdb-f3227.firebasestorage.app",
  messagingSenderId: "845437681474",
  appId: "1:845437681474:web:2d1eb7f8108c2d47f712db",
  measurementId: "G-DX83CEDX6V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };