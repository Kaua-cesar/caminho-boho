// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
// Importa APENAS o provedor Google
import {
   googleProvider,
   signInWithProviderPopup,
} from "../services/auth/authProviders";

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const loginWithProvider = async (providerName) => {
      setLoading(true);
      try {
         let providerToUse;
         switch (providerName) {
            case "google":
               providerToUse = googleProvider;
               break;
            default:
               // console.warn(`Provedor "${providerName}" não suportado.`); // Removido
               // alert(`Provedor "${providerName}" não suportado.`); // Removido
               setLoading(false);
               return false;
         }

         const loggedInUser = await signInWithProviderPopup(providerToUse);
         if (loggedInUser) {
            setUser(loggedInUser);
            // console.log(`Login com ${providerName} (via popup) finalizado e usuário setado.`); // Removido
         } else {
            // console.log(`Login com ${providerName} (via popup) não retornou um usuário.`); // Removido
         }
         return !!loggedInUser;
      } catch (error) {
         // console.error(`Erro ao iniciar login com ${providerName}:`, error.message); // Removido
         setUser(null);
         return false;
      } finally {
         setLoading(false);
      }
   };

   const logout = async () => {
      try {
         await signOut(auth);
         // console.log("Usuário deslogado do Firebase."); // Removido
         setUser(null);
      } catch (error) {
         // console.error("Erro ao fazer logout:", error.message); // Removido
      }
   };

   const loginWithEmailPassword = (email, password) => {
      // console.log(`Simulando login com email: ${email}`); // Removido
      setUser({ email });
   };

   const value = {
      user,
      loading,
      loginWithProvider,
      logout,
      login: loginWithEmailPassword,
   };

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
