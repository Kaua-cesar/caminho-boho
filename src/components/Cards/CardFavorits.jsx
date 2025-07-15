// src/components/Cards/CardFavorits.jsx
import React from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useFavorites } from "../../context/FavoritesContext"; // CORRIGIDO: Caminho para 'FavoritesContext'

export function CardFavorits({ produtoId, desconto }) {
   const { isFavorite, addFavorite, removeFavorite } = useFavorites();

   if (!produtoId) {
      console.warn("CardFavorits: produtoId ausente");
      return null;
   }

   const handleToggleFavorite = () => {
      if (isFavorite(produtoId)) {
         removeFavorite(produtoId);
      } else {
         addFavorite(produtoId);
      }
   };

   return (
      <>
         {/* Exibição do selo de desconto */}
         {desconto && desconto !== 0 && (
            <span className="bg-red-500 text-white px-4 py-1 absolute left-0 top-0 z-10 rounded-xl text-xs m-3 font-semibold">
               -{desconto}%
            </span>
         )}

         {/* Botão de favorito */}
         <span
            className={`p-2 absolute right-0 top-0 z-10 rounded-sm text-xl m-3 font-semibold cursor-pointer ${
               isFavorite(produtoId) ? "text-red-500" : "text-black/40"
            } bg-zinc-200`}
            onClick={handleToggleFavorite}
            aria-label={
               isFavorite(produtoId)
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
            }
         >
            {isFavorite(produtoId) ? <IoHeart /> : <IoHeartOutline />}
         </span>
      </>
   );
}
