// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzEpT5lvO5IN0CEDd64qkw9wGEq20pOp8",
  authDomain: "task-manager-416c8.firebaseapp.com",
  projectId: "task-manager-416c8",
  storageBucket: "task-manager-416c8.firebasestorage.app",
  messagingSenderId: "394345008284",
  appId: "1:394345008284:web:5e49940ba7fe42679e3159",
  measurementId: "G-YZV934K0EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;