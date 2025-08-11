// src/pages/TestPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

// ⭐ MUDANÇA: Para fins de demonstração, vamos simplificar este componente
// e focar no que ele deve exibir. O login de teste pode ser feito na página de login.
const AdminPage = () => {
   // Acessando o utilizador e a função de logout do contexto
   const { user, logout } = useAuth();

   const handleLogout = async () => {
      await logout();
      toast.info("Saiu da sua conta.");
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
            <p className="text-gray-600 mb-6">
               Bem-vindo, {user?.displayName || user?.email}!
            </p>
            <p className="text-green-600 font-semibold mb-6">
               Acesso de administrador concedido com sucesso.
            </p>
            <button
               onClick={handleLogout}
               className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
               Sair
            </button>
         </div>
      </div>
   );
};

export default AdminPage;
