import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
   onAuthStateChanged,
   signOut,
   signInWithEmailAndPassword,
   updateProfile,
   sendEmailVerification,
} from "firebase/auth";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAdmin, setIsAdmin] = useState(false);

   const ADMIN_EMAILS = ["kauacz04coc@gmail.com", "campanariolais@gmail.com"];

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         setLoading(true);

         if (currentUser) {
            if (!currentUser.emailVerified) {
               setUser(null);
               setIsAdmin(false);
            } else {
               setUser(currentUser);
               setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
            }
         } else {
            setUser(null);
            setIsAdmin(false);
         }
         setLoading(false);
      });

      return () => unsubscribe();
   }, []);

   const logout = async () => {
      try {
         await signOut(auth);
         setUser(null);
         setIsAdmin(false);
      } catch (error) {
         console.error("Erro ao fazer logout:", error);
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
      isAdmin,
      loginWithEmailPassword,
      logout,
      resendVerificationEmail,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   return useContext(AuthContext);
}
