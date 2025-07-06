import { IoHeartOutline } from "react-icons/io5";
import { RiShoppingCartFill } from "react-icons/ri";
import Logo from "./assets/logo.png";
import React, { useState, useEffect } from "react";

export function Nav() {
   const [totalFavoritos, setTotalFavoritos] = useState(0); // Atualiza o total de favoritos a partir do localStorage
   function atualizarTotalFavoritos() {
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      setTotalFavoritos(favoritos.length);
   }

   // Atualiza totalFavoritos quando a Home montar
   React.useEffect(() => {
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
      <div className="text-amber-600  font-semibold flex justify-around px-50 w-screen h-17 bg-white shadow-xs shadow-amber-600/50">
         <div className="flex scale-80">
            <img src={Logo} alt="" />
         </div>
         <ul className="flex gap-8 items-center ">
            <li className="cursor-pointer hover:text-amber-500">Inicio</li>
            <li className="cursor-pointer hover:text-amber-500">Produtos</li>
            <li className="cursor-pointer hover:text-amber-500">Categorias</li>
            <li className="cursor-pointer hover:text-amber-500">Sobre</li>
            <li className="cursor-pointer hover:text-amber-500">Contato</li>
         </ul>
         <div className="flex items-center gap-10 text-2xl">
            <div className="relative">
               <IoHeartOutline className="cursor-pointer" />
               {totalFavoritos >= 1 ? (
                  <span className="absolute -top-2 -right-3 text-white bg-amber-500 text-xs p-1 rounded-full">
                     {totalFavoritos}
                  </span>
               ) : (
                  ""
               )}
            </div>
            <RiShoppingCartFill className="cursor-pointer" />
         </div>
      </div>
   );
}
