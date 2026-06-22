import { initializeApp, getApps, getApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUBWhrrKuvTLK-HZ7X-ak6eTul4xdkXFQ",
  authDomain: "sheikh-ibrahim-ashraf.firebaseapp.com",
  projectId: "sheikh-ibrahim-ashraf",
  storageBucket: "sheikh-ibrahim-ashraf.firebasestorage.app",
  messagingSenderId: "210796224926",
  appId: "1:210796224926:web:c807e7b75969f1a411f68f",
  measurementId: "G-D1RRNCVY0E"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);