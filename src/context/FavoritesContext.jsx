import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
   const { user, loading: authLoading } = useAuth();
   const [favorites, setFavorites] = useState([]);
   const [favoritesLoading, setFavoritesLoading] = useState(true);

   // Sincroniza favoritos removendo IDs que não existem
   useEffect(() => {
      const fetchFavorites = async () => {
         if (authLoading) return;

         if (user) {
            setFavoritesLoading(true);
            try {
               const userFavoritesRef = doc(db, "favorites", user.uid);
               const docSnap = await getDoc(userFavoritesRef);

               if (docSnap.exists()) {
                  let userFavorites = docSnap.data().items || [];

                  // Busca todos os produtos existentes
                  const produtosSnapshot = await getDocs(
                     collection(db, "produtos")
                  );
                  const produtosIds = produtosSnapshot.docs.map(
                     (doc) => doc.id
                  );

                  // Filtra apenas IDs válidos
                  const validFavorites = userFavorites.filter((id) =>
                     produtosIds.includes(id)
                  );

                  // Atualiza Firebase se necessário
                  if (validFavorites.length !== userFavorites.length) {
                     await setDoc(userFavoritesRef, { items: validFavorites });
                  }

                  setFavorites(validFavorites);
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
      if (success) toast.success("Produto adicionado aos favoritos!");
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
         return false; // produto já removido ou inexistente
      }

      const success = await updateFavoritesInFirebase(filteredFavorites);
      if (success) toast.info("Produto removido dos favoritos.");
      return success;
   };

   const isFavorite = (productId) => favorites.includes(productId);

   const value = {
      favorites,
      favoritesLoading,
      addFavorite,
      removeFavorite,
      isFavorite,
      totalFavorites: favorites.length,
   };

   return (
      <FavoritesContext.Provider value={value}>
         {children}
      </FavoritesContext.Provider>
   );
};
