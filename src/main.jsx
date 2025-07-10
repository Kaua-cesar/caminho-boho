import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { Nav } from "./Nav";
import { Carrosel } from "./Carrosel";
import { Home } from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MinhaConta from "./pages/MinhaConta";
import Carrinho from "./pages/Carrinho";
import RotaPrivada from "./components/auth/RotaPrivada";
import RotaPublica from "./components/auth/RotaPublica";

function Layout() {
   const location = useLocation();

   const esconderCarrosel = [
      "/login",
      "/register",
      "/minha-conta",
      "/carrinho",
      "/finalizar-compra",
   ].some((path) => location.pathname.startsWith(path));
   const mostrarCarrosel = !esconderCarrosel;

   return (
      <>
         {/* Nav fixo, sobreposto, sem reservar espaço */}
         <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-xs shadow-amber-600/50 h-17 ">
            <Nav />
         </div>

         {/* Aqui, NÃO coloque padding/margin top, pois Nav é sobreposto */}

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
            </Routes>
         </div>
      </>
   );
}

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <AuthProvider>
         <BrowserRouter>
            <Layout />
         </BrowserRouter>
      </AuthProvider>
   </StrictMode>
);
