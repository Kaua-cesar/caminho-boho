// src/context/FavoritesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; // Para notificações

const FavoritesContext = createContext();

export const useFavorites = () => {
   return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
   const [favorites, setFavorites] = useState([]); // Array de IDs de produtos favoritos

   // Carregar favoritos do localStorage ao iniciar
   useEffect(() => {
      try {
         const storedFavorites = localStorage.getItem("favorites");
         if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
         }
      } catch (error) {
         console.error("Erro ao carregar favoritos do localStorage", error);
         // Opcional: toast.error("Erro ao carregar favoritos.");
      }
   }, []);

   // Salvar favoritos no localStorage sempre que forem alterados
   useEffect(() => {
      try {
         localStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
         console.error("Erro ao salvar favoritos no localStorage", error);
         // Opcional: toast.error("Erro ao salvar favoritos.");
      }
   }, [favorites]);

   const addFavorite = (productId) => {
      setFavorites((prevFavorites) => {
         if (!prevFavorites.includes(productId)) {
            toast.success("Produto adicionado aos favoritos!");
            return [...prevFavorites, productId];
         }
         toast.info("Este produto já está nos seus favoritos.");
         return prevFavorites;
      });
   };

   const removeFavorite = (productId) => {
      setFavorites((prevFavorites) => {
         const newFavorites = prevFavorites.filter((id) => id !== productId);
         if (newFavorites.length < prevFavorites.length) {
            // Verifica se realmente removeu
            toast.info("Produto removido dos favoritos.");
         }
         return newFavorites;
      });
   };

   const isFavorite = (productId) => {
      return favorites.includes(productId);
   };

   const getFavoriteIds = () => {
      return favorites;
   };

   const clearFavorites = () => {
      setFavorites([]);
      toast.info("Todos os favoritos foram removidos.");
   };

   const value = {
      favorites, // Lista de IDs de favoritos
      addFavorite,
      removeFavorite,
      isFavorite,
      getFavoriteIds,
      clearFavorites,
      totalFavorites: favorites.length, // Para o contador
   };

   return (
      <FavoritesContext.Provider value={value}>
         {children}
      </FavoritesContext.Provider>
   );
};
