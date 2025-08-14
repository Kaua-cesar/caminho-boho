import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import { Toaster } from "sonner";

import { Nav } from "./components/layout/Nav";
import { Carrosel } from "./Carrosel";
import { Home } from "./components/layout/Home";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MinhaConta from "./pages/MinhaConta";
import Carrinho from "./pages/Carrinho";
import { FavoritesPage } from "./pages/FavoritesPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ProductsByCategoryPage } from "./pages/products/ProductsByCategoryPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

import RotaPrivada from "./components/auth/RotaPrivada";
import RotaPublica from "./components/auth/RotaPublica";
import AdminPrivateRoute from "./components/auth/AdminPrivateRoute";
import AdminPage from "./pages/Admin/AdminPage";
import AdminUpload from "./pages/Admin/AdminUpload";

function Layout() {
   const location = useLocation();

   const mostrarNav =
      location.pathname !== "/admin" && location.pathname !== "/add-products";

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
      "/admin",
      "/add-products",
   ];

   const isCategoryProductRoute = location.pathname.startsWith(
      "/produtos/categoria/"
   );
   const mostrarCarrosel =
      !rotasSemCarrosel.some((path) => location.pathname.startsWith(path)) &&
      !isCategoryProductRoute;

   return (
      <>
         {mostrarNav && (
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-xs shadow-amber-600/50 h-17">
               <Nav />
            </div>
         )}
         <div>
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
               <Route element={<AdminPrivateRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
               </Route>
               <Route path="/add-products" element={<AdminUpload />} />
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
