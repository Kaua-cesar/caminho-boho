// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
   onAuthStateChanged,
   signOut,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   updateProfile,
   sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         if (currentUser) {
            if (!currentUser.emailVerified) {
               setUser(null);
            } else {
               setUser(currentUser);
            }
         } else {
            setUser(null);
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
            // Cria o documento do usuário no Firestore após o login via provedor
            await setDoc(
               doc(db, "users", loggedInUser.uid),
               {
                  email: loggedInUser.email,
                  nomeCompleto: loggedInUser.displayName,
               },
               { merge: true }
            );
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
         // Handle error if needed
      }
   };

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
            await signOut(auth);
            setUser(null);
            const error = new Error("E-mail não verificado.");
            error.code = "auth/email-not-verified";
            error.user = userCredential.user;
            throw error;
         }

         setUser(userCredential.user);
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

   const register = async (email, password, additionalData) => {
      setLoading(true);
      const start = Date.now();
      try {
         const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
         );
         const user = userCredential.user;

         await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            ...additionalData,
         });

         if (additionalData.nomeCompleto) {
            await updateProfile(user, {
               displayName: additionalData.nomeCompleto,
            });
         }

         await sendEmailVerification(user);
         await signOut(auth);

         return true;
      } catch (error) {
         console.error("Erro durante o processo de registro:", error);
         setUser(null);

         let errorMessage =
            "Ocorreu um erro no registro. Por favor, tente novamente.";

         switch (error.code) {
            case "auth/email-already-in-use":
               errorMessage = "Este e-mail já está em uso.";
               break;
            case "auth/invalid-email":
               errorMessage = "O e-mail fornecido é inválido.";
               break;
            case "auth/operation-not-allowed":
               errorMessage = "O método de autenticação não está habilitado.";
               break;
            case "auth/weak-password":
               errorMessage = "A senha é muito fraca.";
               break;
            default:
               errorMessage =
                  "Ocorreu um erro no registro. Por favor, tente novamente.";
               break;
         }

         throw new Error(errorMessage);
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
