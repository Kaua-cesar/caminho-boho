// src/components/auth/AdminPrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminPage from "../../pages/Admin/AdminPage";

/**
 * @description Componente de rota privada para administradores.
 * Ele verifica o estado de autenticação e o papel do usuário no AuthContext.
 * Se o usuário não for um admin, ele será redirecionado para a página inicial.
 */
const AdminPrivateRoute = () => {
   const { user, isAuthenticated } = useContext(AuthContext);

   const isAdmin = user && user.role === "admin";

   if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/" replace />;
   }

   return <AdminPage />;
};

export default AdminPrivateRoute;
