import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase"; // Certifique-se de que o caminho para o firebase é este
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext"; // Importa o contexto de autenticação
import { toast } from "sonner";

const FavoritesContext = createContext();

export const useFavorites = () => {
   return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
   const { user, loading: authLoading } = useAuth();
   const [favorites, setFavorites] = useState([]);
   const [favoritesLoading, setFavoritesLoading] = useState(true);

   // Efeito para carregar os favoritos do Firebase quando o usuário ou authLoading mudar
   useEffect(() => {
      const fetchFavorites = async () => {
         if (authLoading) return;

         if (user) {
            setFavoritesLoading(true);
            try {
               const userFavoritesRef = doc(db, "favorites", user.uid);
               const docSnap = await getDoc(userFavoritesRef);

               if (docSnap.exists()) {
                  setFavorites(docSnap.data().items || []);
               } else {
                  await setDoc(userFavoritesRef, { items: [] });
                  setFavorites([]);
               }
            } catch (error) {
               console.error("Erro ao carregar favoritos do Firebase:", error);
               toast.error("Erro ao carregar seus favoritos.");
               setFavorites([]);
            } finally {
               setFavoritesLoading(false);
            }
         } else {
            setFavorites([]);
            setFavoritesLoading(false);
         }
      };

      fetchFavorites();
   }, [user, authLoading]);

   // Função auxiliar para atualizar os favoritos no Firebase
   const updateFavoritesInFirebase = async (updatedItems) => {
      if (!user) return false;

      setFavoritesLoading(true);
      try {
         const userFavoritesRef = doc(db, "favorites", user.uid);
         await setDoc(userFavoritesRef, { items: updatedItems });
         setFavorites(updatedItems);
         return true;
      } catch (error) {
         console.error("Erro ao salvar favoritos no Firebase:", error);
         toast.error("Erro ao salvar favoritos. Tente novamente.");
         return false;
      } finally {
         setFavoritesLoading(false);
      }
   };

   const addFavorite = async (productId) => {
      if (!user) {
         toast.info(
            "Você precisa estar logado para adicionar produtos aos favoritos."
         );
         return false;
      }

      if (favorites.includes(productId)) {
         toast.info("Este produto já está nos seus favoritos.");
         return false;
      }

      const newFavorites = [...favorites, productId];
      const success = await updateFavoritesInFirebase(newFavorites);
      if (success) {
         // ✨ Notificação de sucesso ao adicionar
         toast.success("Produto adicionado aos favoritos!");
      }
      return success;
   };

   const removeFavorite = async (productId) => {
      if (!user) {
         toast.info(
            "Você precisa estar logado para remover produtos dos favoritos."
         );
         return false;
      }

      const filteredFavorites = favorites.filter((id) => id !== productId);
      if (filteredFavorites.length === favorites.length) {
         toast.info("Este produto não foi encontrado nos seus favoritos.");
         return false;
      }

      const success = await updateFavoritesInFirebase(filteredFavorites);
      if (success) {
         // ✨ Notificação de sucesso ao remover
         toast.info("Produto removido dos favoritos.");
      }
      return success;
   };

   const isFavorite = (productId) => favorites.includes(productId);

   // ✨ A função `clearFavorites` e toda a sua lógica foram removidas.

   const value = {
      favorites,
      favoritesLoading,
      addFavorite,
      removeFavorite,
      isFavorite,
      totalFavorites: favorites.length,
      // ✨ `clearFavorites` não é mais exportado.
   };

   return (
      <FavoritesContext.Provider value={value}>
         {children}
      </FavoritesContext.Provider>
   );
};
