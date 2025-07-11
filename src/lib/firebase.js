// src/lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Adicione a importação de getFirestore AQUI
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Se você estiver usando autenticação, também precisará desta

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDuzs7C2bcwm0fuen7g-Etnf0SYqXDh3lo",
   authDomain: "caminhoboho-66c5b.firebaseapp.com",
   projectId: "caminhoboho-66c5b",
   storageBucket: "caminhoboho-66c5b.firebasestorage.app",
   messagingSenderId: "680816493456",
   appId: "1:680816493456:web:54b539e95686ffc83e6915",
   // measurementId: "YOUR_MEASUREMENT_ID", // Opcional, se estiver usando Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore AQUI
export const db = getFirestore(app); // Esta é a linha 23 que está dando erro no seu código
export const auth = getAuth(app);
