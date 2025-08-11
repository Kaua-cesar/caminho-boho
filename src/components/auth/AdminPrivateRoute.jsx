// src/components/auth/AdminPrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * @description Componente de rota privada para administradores.
 * Ele verifica o estado de autenticação e se o utilizador é um admin.
 * Se o utilizador não for um admin, ele será redirecionado para a página de login.
 */
const AdminPrivateRoute = () => {
   const { user, loading, isAdmin } = useAuth();

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p>A carregar...</p>
         </div>
      );
   }

   if (!user || !isAdmin) {
      return <Navigate to="/login" replace />;
   }

   // Se o utilizador for um admin, renderiza o componente aninhado da rota.
   return <Outlet />;
};

export default AdminPrivateRoute;
