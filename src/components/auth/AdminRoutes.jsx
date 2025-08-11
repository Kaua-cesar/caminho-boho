// src/components/auth/AdminPrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// A importação de AdminRoutes foi removida pois não existe o arquivo.
import AdminPage from "../../pages/AdminPage"; // Importa a página de administração diretamente.

/**
 * @description Componente de rota privada para administradores.
 * Ele verifica o estado de autenticação e o papel do usuário no AuthContext.
 * Se o usuário não for um admin, ele será redirecionado para a página inicial.
 */
const AdminPrivateRoute = () => {
   // Pega o estado de autenticação e o papel do usuário do contexto
   const { user, isAuthenticated } = useContext(AuthContext);

   // Simulação de verificação de permissão de admin.
   // Na sua aplicação real, a propriedade `role` viria do objeto `user`.
   const isAdmin = user && user.role === "admin";

   // Se o usuário não estiver autenticado ou não for um admin, redireciona para a página inicial.
   if (!isAuthenticated || !isAdmin) {
      // Você pode redirecionar para a página de login se preferir
      return <Navigate to="/" replace />;
   }

   // Se o usuário for um admin, renderiza a página de administração.
   // O Outlet foi removido, pois não há rotas aninhadas para serem renderizadas.
   return <AdminPage />;
};

export default AdminPrivateRoute;
