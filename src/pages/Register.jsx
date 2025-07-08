import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
   const { login } = useAuth(); // usando login direto para simplificar
   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [nome, setNome] = useState("");

   function handleSubmit(e) {
      e.preventDefault();
      // Aqui você faria validação e criação real no backend
      login(email, senha); // simula login após registro
      navigate("/minha-conta");
   }

   return (
      <div className="flex items-center justify-center h-screen">
         <div className="max-w-sm mx-auto p-6 mt-20 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Criar Conta</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input
                  type="text"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
               />
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
                  Cadastrar
               </button>
            </form>
         </div>
      </div>
   );
}
