// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTmxDcO3UYH9uzrPOyulaMTCRsk-_jTxI",
  authDomain: "proyecto-react-91b15.firebaseapp.com",
  projectId: "proyecto-react-91b15",
  storageBucket: "proyecto-react-91b15.appspot.com",
  messagingSenderId: "867034022709",
  appId: "1:867034022709:web:3a60a9c710c80dce69027c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)