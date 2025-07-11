import { IoHeartOutline } from "react-icons/io5";
import { RiShoppingCartFill } from "react-icons/ri";
import Logo from "./assets/logo.png";
import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "./context/AuthContext";

function estaNaRota(rotas, caminhoAtual) {
   return rotas.includes(caminhoAtual);
}

export function Nav() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

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

   const naRotaLoginOuRegister = estaNaRota(
      ["/login", "/register"],
      location.pathname
   );

   return (
      <>
         {!naRotaLoginOuRegister && (
            <div className="  text-amber-600 font-semibold flex items-center justify-between px-8 md:px-32 w-full h-17 bg-white shadow-xs shadow-amber-600/50">
               <div className="flex items-center">
                  <Link to="/">
                     <img
                        src={Logo}
                        alt="Logo Caminho Boho"
                        className="h-10 md:h-14"
                     />
                  </Link>
               </div>
               <ul className="hidden md:flex gap-4 md:gap-8 items-center text-base md:text-lg">
                  <Link to="/" className="cursor-pointer hover:text-amber-500">
                     Inicio
                  </Link>
                  <Link
                     to="/produtos"
                     className="cursor-pointer hover:text-amber-500"
                  >
                     Produtos
                  </Link>
                  <Link
                     to="/categorias"
                     className="cursor-pointer hover:text-amber-500"
                  >
                     Categorias
                  </Link>
                  <Link
                     to="/sobre"
                     className="cursor-pointer hover:text-amber-500"
                  >
                     Sobre
                  </Link>
                  <Link
                     to="/contato"
                     className="cursor-pointer hover:text-amber-500"
                  >
                     Contato
                  </Link>
               </ul>
               <div className="flex items-center gap-8 md:gap-10 text-2xl md:text-3xl">
                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <FiUser className="cursor-pointer" />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        {user ? (
                           <>
                              <DropdownMenuLabel>
                                 Olá, {user.displayName || user.email}
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                 onClick={() => navigate("/minha-conta")}
                              >
                                 Minha conta
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() => navigate("/meus-pedidos")}
                              >
                                 Meus pedidos
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() => {
                                    logout();
                                    navigate("/");
                                 }}
                              >
                                 Sair
                              </DropdownMenuItem>
                           </>
                        ) : (
                           <>
                              <DropdownMenuLabel>Bem-vindo</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                 onClick={() => navigate("/login")}
                              >
                                 Login
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() => navigate("/register")}
                              >
                                 Criar conta
                              </DropdownMenuItem>
                           </>
                        )}
                     </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="relative">
                     <IoHeartOutline className="cursor-pointer" />
                     {totalFavoritos >= 1 && (
                        <span className="absolute -top-2 -right-2 text-white bg-amber-500 text-xs p-1 rounded-full">
                           {totalFavoritos}
                        </span>
                     )}
                  </div>

                  <RiShoppingCartFill
                     className="cursor-pointer"
                     onClick={() => navigate("/carrinho")}
                  />
               </div>
            </div>
         )}
         {naRotaLoginOuRegister && (
            <div className="  text-amber-600 font-semibold flex items-center justify-center px-8 md:px-32 w-full h-17 bg-white shadow-xs shadow-amber-600/50">
               <div className="flex items-center">
                  <Link to="/">
                     <img
                        src={Logo}
                        alt="Logo Caminho Boho"
                        className="h-10 md:h-14"
                     />
                  </Link>
               </div>
            </div>
         )}
      </>
   );
}
