// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
   onAuthStateChanged,
   signOut,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   updateProfile,
   sendEmailVerification,
} from "firebase/auth";
import {
   googleProvider,
   signInWithProviderPopup,
} from "../services/auth/authProviders";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         // Lógica de verificação de e-mail simplificada e mais robusta.
         // A regra agora é clara: um usuário só é considerado "logado" em nosso app se seu e-mail for verificado.
         if (currentUser && !currentUser.emailVerified) {
            // Esta condição afeta principalmente novos usuários de email/senha.
            // Ao se registrar, `currentUser` existe, mas `emailVerified` é `false`.
            // Ao definir o usuário do contexto como `null`, evitamos o redirecionamento
            // automático para páginas protegidas antes da verificação (corrige a "race condition").
            // Usuários de login social (Google) geralmente já vêm com e-mail verificado.
            setUser(null);
         } else {
            // Define o usuário se ele estiver verificado ou se for `null` (caso de logout).
            setUser(currentUser);
         }
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
               setLoading(false);
               return false;
         }

         const loggedInUser = await signInWithProviderPopup(providerToUse);
         if (loggedInUser) {
            setUser(loggedInUser);
         }
         return !!loggedInUser;
      } catch (error) {
         setUser(null);
         return false;
      } finally {
         setLoading(false);
      }
   };

   const logout = async () => {
      try {
         await signOut(auth);
         setUser(null);
      } catch (error) {
         // Trate o erro se necessário
      }
   };

   // Função de login com e-mail e senha
   const loginWithEmailPassword = async (email, password) => {
      setLoading(true);
      const start = Date.now();
      try {
         const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
         );

         if (!userCredential.user.emailVerified) {
            await signOut(auth); // Garante que o usuário não fique logado
            setUser(null);
            const error = new Error("E-mail não verificado.");
            error.code = "auth/email-not-verified";
            // Anexamos o usuário ao erro para poder reenviar o e-mail se necessário
            error.user = userCredential.user;
            throw error;
         }

         setUser(userCredential.user); // Define o usuário no contexto apenas se verificado
         return true;
      } catch (error) {
         setUser(null);
         throw error;
      } finally {
         const elapsed = Date.now() - start;
         const delay = Math.max(0, 600 - elapsed);
         setTimeout(() => setLoading(false), delay);
      }
   };

   const register = async (email, password, nome) => {
      setLoading(true);
      const start = Date.now();
      try {
         const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
         );
         const user = userCredential.user;
         if (nome) {
            await updateProfile(user, { displayName: nome });
         }
         console.log(
            "Usuário criado. Tentando enviar e-mail de verificação para:",
            user.email
         );
         await sendEmailVerification(user);
         console.log(
            "Comando para enviar e-mail de verificação executado com sucesso."
         );
         await signOut(auth);
         console.log("Usuário deslogado para forçar a verificação.");
         return true; // Sucesso no registro
      } catch (error) {
         // Este log é crucial. Se houver um erro ao enviar o e-mail, ele aparecerá aqui.
         console.error("Erro durante o processo de registro:", error);
         setUser(null);
         throw error;
      } finally {
         const elapsed = Date.now() - start;
         const delay = Math.max(0, 2000 - elapsed);
         setTimeout(() => setLoading(false), delay);
      }
   };

   const resendVerificationEmail = async (userToVerify) => {
      if (!userToVerify) {
         toast.error(
            "Não foi possível identificar o usuário para reenviar o e-mail."
         );
         return;
      }
      try {
         await sendEmailVerification(userToVerify);
         toast.success("Um novo e-mail de verificação foi enviado!");
      } catch (error) {
         toast.error("Erro ao reenviar o e-mail. Tente novamente mais tarde.");
      }
   };

   const value = {
      user,
      loading,
      loginWithEmailPassword,
      loginWithProvider,
      logout,
      register,
      resendVerificationEmail,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   return useContext(AuthContext);
}
