import { useAuth } from "../context/AuthContext";

export default function MinhaConta() {
   const { user, logout } = useAuth();

   return (
      <div className="max-w-md mx-auto p-6 mt-20 bg-white rounded shadow">
         <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
         <p className="mb-6">Olá, {user?.displayName || user.email}</p>
         <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
         >
            Sair
         </button>
      </div>
   );
}
