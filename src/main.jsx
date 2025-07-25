// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import { Toaster } from "sonner";

import { Nav } from "./Nav";
import { Carrosel } from "./Carrosel";

import { Home } from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MinhaConta from "./pages/MinhaConta";
import Carrinho from "./pages/Carrinho";
import { FavoritesPage } from "./pages/FavoritesPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ProductsByCategoryPage } from "./pages/ProductsByCategoryPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

import RotaPrivada from "./components/auth/RotaPrivada";
import RotaPublica from "./components/auth/RotaPublica";

function Layout() {
   const location = useLocation();

   // Rotas onde o carrosel não deve aparecer
   const rotasSemCarrosel = [
      "/login",
      "/register",
      "/minha-conta",
      "/carrinho",
      "/finalizar-compra",
      "/favoritos",
      "/categorias",
      "/produtos",
      "/sobre",
      "/contato",
   ];

   const isCategoryProductRoute = location.pathname.startsWith(
      "/produtos/categoria/"
   );
   const mostrarCarrosel =
      !rotasSemCarrosel.some((path) => location.pathname.startsWith(path)) &&
      !isCategoryProductRoute;

   return (
      <>
         <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-xs shadow-amber-600/50 h-17">
            <Nav />
         </div>
         <div style={{ paddingTop: "4.25rem" }}>
            {mostrarCarrosel && <Carrosel />}
            <Routes>
               <Route path="/" element={<Home />} />
               <Route
                  path="/login"
                  element={
                     <RotaPublica>
                        <Login />
                     </RotaPublica>
                  }
               />
               <Route
                  path="/register"
                  element={
                     <RotaPublica>
                        <Register />
                     </RotaPublica>
                  }
               />
               <Route
                  path="/minha-conta"
                  element={
                     <RotaPrivada>
                        <MinhaConta />
                     </RotaPrivada>
                  }
               />
               <Route
                  path="/carrinho"
                  element={
                     <RotaPrivada>
                        <Carrinho />
                     </RotaPrivada>
                  }
               />
               <Route
                  path="/favoritos"
                  element={
                     <RotaPrivada>
                        <FavoritesPage />
                     </RotaPrivada>
                  }
               />
               <Route path="/categorias" element={<CategoriesPage />} />
               <Route path="/sobre" element={<AboutPage />} />
               <Route path="/contato" element={<ContactPage />} />
               <Route
                  path="/produtos/categoria/:categoryName"
                  element={<ProductsByCategoryPage />}
               />
               <Route path="/produtos" element={<ProductsPage />} />
            </Routes>
         </div>
      </>
   );
}

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <BrowserRouter>
         <AuthProvider>
            <CartProvider>
               <FavoritesProvider>
                  <Layout />
                  <Toaster position="bottom-right" richColors />
               </FavoritesProvider>
            </CartProvider>
         </AuthProvider>
      </BrowserRouter>
   </StrictMode>
);
