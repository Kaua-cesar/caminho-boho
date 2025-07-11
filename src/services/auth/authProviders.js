// src/services/auth/authProviders.js

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebase";

// Provedor Google
export const googleProvider = new GoogleAuthProvider();

// Função genérica para signInWithPopup (apenas Google por enquanto)
export const signInWithProviderPopup = async (provider) => {
   try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log(`Login com ${provider.providerId} bem-sucedido:`, user); // Removido
      return user;
   } catch (error) {
      // console.error(`Erro ao iniciar login com ${provider.providerId}:`, error.message); // Removido
      throw error; // Ainda lança o erro para ser capturado no AuthContext
   }
};

// handleGoogleRedirectResult não será usado com popups
export const handleGoogleRedirectResult = async () => {
   // console.log("handleGoogleRedirectResult: Esta função não é usada com signInWithPopup."); // Removido
   return null;
};
