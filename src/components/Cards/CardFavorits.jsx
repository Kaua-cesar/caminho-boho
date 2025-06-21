import React, { useEffect, useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export function CardFavorits({ produtoId, desconto, atualizarTotalFavoritos }) {
   if (!produtoId) {
      console.warn("CardFavorits: produtoId ausente");
      return null;
   }

   const [favorito, setFavorito] = useState(false);

   const id = String(produtoId);

   useEffect(() => {
      const favoritosSalvos =
         JSON.parse(localStorage.getItem("favoritos")) || [];
      setFavorito(favoritosSalvos.includes(id));
   }, [id]);

   const toggleFavorito = () => {
      const favoritosSalvos =
         JSON.parse(localStorage.getItem("favoritos")) || [];
      const jaFavoritado = favoritosSalvos.includes(id);
      const novosFavoritos = jaFavoritado
         ? favoritosSalvos.filter((favId) => favId !== id)
         : [...favoritosSalvos, id];

      localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
      window.dispatchEvent(new Event("favoritosAtualizados")); // ADICIONE ESTA LINHA
      setFavorito(!jaFavoritado);

      // Chama a função da Home para atualizar o total na UI imediatamente
      if (typeof atualizarTotalFavoritos === "function") {
         atualizarTotalFavoritos();
      }
   };

   return (
      <>
         {desconto && (
            <span className="bg-red-500 text-white px-4 py-1 absolute left-0 top-0 z-10 rounded-xl text-xs m-3 font-semibold">
               {desconto}%
            </span>
         )}
         <span
            className={`p-2 absolute right-0 top-0 z-10 rounded-sm text-xl m-3 font-semibold cursor-pointer ${
               favorito ? "text-red-500" : "text-black/40"
            } bg-zinc-200`}
            onClick={toggleFavorito}
         >
            {favorito ? <IoHeart /> : <IoHeartOutline />}
         </span>
      </>
   );
}
