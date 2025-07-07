import { IoHeartOutline } from "react-icons/io5";
import { RiShoppingCartFill } from "react-icons/ri";
import Logo from "./assets/logo.png";
import React, { useState, useEffect } from "react";

export function Nav() {
   const [totalFavoritos, setTotalFavoritos] = useState(0);
   function atualizarTotalFavoritos() {
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      setTotalFavoritos(favoritos.length);
   }

   useEffect(() => {
      atualizarTotalFavoritos();
      function onFavoritosAtualizados() {
         atualizarTotalFavoritos();
      }
      window.addEventListener("favoritosAtualizados", onFavoritosAtualizados);
      return () => {
         window.removeEventListener(
            "favoritosAtualizados",
            onFavoritosAtualizados
         );
      };
   }, []);

   return (
      <div className="text-amber-600 font-semibold flex items-center justify-between px-4 md:px-32 w-full h-17 bg-white shadow-xs shadow-amber-600/50">
         <div className="flex items-center">
            <img src={Logo} alt="Logo Caminho Boho" className="h-10 md:h-14" />
         </div>
         <ul className="hidden md:flex gap-4 md:gap-8 items-center text-base md:text-lg">
            <li className="cursor-pointer hover:text-amber-500">Inicio</li>
            <li className="cursor-pointer hover:text-amber-500">Produtos</li>
            <li className="cursor-pointer hover:text-amber-500">Categorias</li>
            <li className="cursor-pointer hover:text-amber-500">Sobre</li>
            <li className="cursor-pointer hover:text-amber-500">Contato</li>
         </ul>
         <div className="flex items-center gap-4 md:gap-10 text-2xl md:text-3xl">
            <div className="relative">
               <IoHeartOutline className="cursor-pointer" />
               {totalFavoritos >= 1 && (
                  <span className="absolute -top-2 -right-3 text-white bg-amber-500 text-xs p-1 rounded-full">
                     {totalFavoritos}
                  </span>
               )}
            </div>
            <RiShoppingCartFill className="cursor-pointer" />
         </div>
      </div>
   );
}
