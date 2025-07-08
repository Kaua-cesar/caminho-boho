import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
   const { login } = useAuth();
   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");

   function handleSubmit(e) {
      e.preventDefault();
      login(email, senha);
      navigate("/minha-conta");
   }

   return (
      <div className="flex items-center justify-center h-screen">
         <div className="max-w-sm  md:mx-auto mx-6 p-6  bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
               />
               <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
               />
               <button
                  type="submit"
                  className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
               >
                  Entrar
               </button>
            </form>
         </div>
      </div>
   );
}
