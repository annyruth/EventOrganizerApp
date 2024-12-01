// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArIipq2aG8RXg2tyLVbzG97VrQ7Drsues",
  authDomain: "info-6132-lab-04-cc5ec.firebaseapp.com",
  projectId: "info-6132-lab-04-cc5ec",
  storageBucket: "info-6132-lab-04-cc5ec.appspot.com",
  messagingSenderId: "662399837626",
  appId: "1:662399837626:web:6df002daf25033dbbb6983"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
