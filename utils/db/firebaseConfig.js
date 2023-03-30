import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
    authDomain: "tap2chat-demo.firebaseapp.com",
    projectId: "tap2chat-demo",
    storageBucket: "tap2chat-demo.appspot.com",
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: "1:1002233397154:web:2dd220534d222b7bc9fcfb",
    measurementId: "G-L5V74T3ZFC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, GoogleAuthProvider, signInWithPopup };
