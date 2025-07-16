import { IoHeartOutline } from "react-icons/io5";
import { RiShoppingCartFill } from "react-icons/ri";
import { BiSolidCategory } from "react-icons/bi";
import { IoCubeOutline } from "react-icons/io5";
import { FaBagShopping } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import Logo from "./assets/logo.png";
import { FaHome } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import React, { useState } from "react";
import { FiUser, FiMenu } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
   SheetClose,
} from "@/components/ui/sheet";

import { useAuth } from "./context/AuthContext";
import { useFavorites } from "./context/FavoritesContext";
import { useCart } from "./context/CartContext";

function estaNaRota(rotas, caminhoAtual) {
   return rotas.includes(caminhoAtual);
}

export function Nav() {
   const { user, logout } = useAuth();
   const { totalFavorites } = useFavorites();
   const { totalItems: totalCartItems } = useCart();

   const navigate = useNavigate();
   const location = useLocation();

   const naRotaLoginOuRegister = estaNaRota(
      ["/login", "/register"],
      location.pathname
   );

   const [isMenuOpen, setIsMenuOpen] = useState(false);

   return (
      <>
         {!naRotaLoginOuRegister && (
            <div className="text-amber-600 font-semibold flex items-center justify-between px-4 md:px-32 w-full h-17 bg-white shadow-xs shadow-amber-600/50">
               <div className="flex items-center">
                  <Link to="/">
                     <img
                        src={Logo}
                        alt="Logo Caminho Boho"
                        className="h-10 md:h-14"
                     />
                  </Link>
               </div>

               {/* Links de Navegação Principal (visíveis apenas em telas maiores) */}
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

               {/* Ícone de Menu Hambúrguer (visível apenas em telas pequenas) */}
               <div className="md:hidden flex items-center gap-4">
                  {/* Ícones de Usuário, Favoritos e Carrinho para mobile */}
                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <FiUser className="cursor-pointer text-2xl" />
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

                  <Link to="/favoritos" className="relative">
                     <IoHeartOutline className="cursor-pointer text-2xl" />
                     {totalFavorites > 0 && (
                        <span className="absolute -top-1 -right-1 text-white bg-amber-500 text-[10px] p-[0.2em] rounded-full flex items-center justify-center min-w-[1em] h-[1em]">
                           {totalFavorites}
                        </span>
                     )}
                  </Link>

                  <Link to="/carrinho" className="relative">
                     <RiShoppingCartFill className="cursor-pointer text-2xl" />
                     {totalCartItems > 0 && (
                        <span className="absolute -top-1 -right-1 text-white bg-amber-500 text-[10px] p-[0.2em] rounded-full flex items-center justify-center min-w-[1em] h-[1em]">
                           {totalCartItems}
                        </span>
                     )}
                  </Link>
                  <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                     <SheetTrigger asChild>
                        <button aria-label="Abrir menu de navegação">
                           <FiMenu className="text-2xl cursor-pointer" />
                        </button>
                     </SheetTrigger>
                     <SheetContent side="left">
                        <SheetHeader>
                           <SheetTitle>Navegação</SheetTitle>
                           <SheetDescription>
                              Explore a Caminho Boho
                           </SheetDescription>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4 mt-8 text-lg">
                           <SheetClose asChild>
                              <Link
                                 to="/"
                                 className="flex flex-row items-center font-medium ml-6 gap-3 text-xl"
                              >
                                 <FaHome />
                                 <span>Inicio</span> {/* ✨ Corrigido aqui */}
                              </Link>
                           </SheetClose>
                           <SheetClose asChild>
                              <Link
                                 to="/produtos"
                                 className="flex flex-row items-center font-medium ml-6 gap-3 text-xl"
                              >
                                 <FaBagShopping />
                                 <span>Produtos</span> {/* ✨ Corrigido aqui */}
                              </Link>
                           </SheetClose>
                           <SheetClose asChild>
                              <Link
                                 to="/categorias"
                                 className="flex flex-row items-center font-medium ml-6 gap-3 text-xl"
                              >
                                 <BiSolidCategory />
                                 <span>Categorias</span>{" "}
                                 {/* ✨ Corrigido aqui */}
                              </Link>
                           </SheetClose>
                           <SheetClose asChild>
                              <Link
                                 to="/sobre"
                                 className="flex flex-row items-center font-medium ml-6 gap-3 text-xl"
                              >
                                 <HiSparkles />
                                 <span>Sobre</span> {/* ✨ Corrigido aqui */}
                              </Link>
                           </SheetClose>
                           <SheetClose asChild>
                              <Link
                                 to="/contato"
                                 className="flex flex-row items-center font-medium ml-6 gap-3 text-xl"
                              >
                                 <MdSupportAgent /> <span>Contato</span>{" "}
                                 {/* ✨ Corrigido aqui */}
                              </Link>
                           </SheetClose>
                        </nav>
                     </SheetContent>
                  </Sheet>
               </div>

               <div className="hidden md:flex items-center gap-8 md:gap-10 text-2xl md:text-3xl">
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

                  <Link to="/favoritos" className="relative">
                     <IoHeartOutline className="cursor-pointer" />
                     {totalFavorites > 0 && (
                        <span className="absolute -top-2 -right-2 text-white bg-amber-500 text-xs p-1 rounded-full flex items-center justify-center min-w-[1.25rem] h-[1.25rem]">
                           {totalFavorites}
                        </span>
                     )}
                  </Link>

                  <Link to="/carrinho" className="relative">
                     <RiShoppingCartFill className="cursor-pointer" />
                     {totalCartItems > 0 && (
                        <span className="absolute -top-2 -right-2 text-white bg-amber-500 text-xs p-1 rounded-full flex items-center justify-center min-w-[1.25rem] h-[1.25rem]">
                           {totalCartItems}
                        </span>
                     )}
                  </Link>
               </div>
            </div>
         )}
         {naRotaLoginOuRegister && (
            <div className="text-amber-600 font-semibold flex items-center justify-center px-8 md:px-32 w-full h-17 bg-white shadow-xs shadow-amber-600/50">
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
