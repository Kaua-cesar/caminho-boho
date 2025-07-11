// src/lib/firebase.js

// Importa as funções necessárias do Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase (substitua pelos seus próprios valores)
const firebaseConfig = {
   apiKey: "AIzaSyDuzs7C2bcwm0fuen7g-Etnf0SYqXDh3lo",
   authDomain: "caminhoboho-66c5b.firebaseapp.com",
   projectId: "caminhoboho-66c5b",
   storageBucket: "caminhoboho-66c5b.firebasestorage.app",
   messagingSenderId: "680816493456",
   appId: "1:680816493456:web:54b539e95686ffc83e6915",
   // measurementId: "YOUR_MEASUREMENT_ID", // Opcional, se estiver usando Analytics
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém instâncias dos serviços
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- Agora getFirestore estará definido
