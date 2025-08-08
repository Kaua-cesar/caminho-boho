import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
   const { register, loading, user } = useAuth();
   const navigate = useNavigate();

   const [nome, setNome] = useState("");
   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");

   async function handleSubmit(e) {
      e.preventDefault();
      try {
         await register(email, senha, nome);
         toast.info("Quase lá! Verifique seu e-mail", {
            description: `Enviamos um link de confirmação para ${email}. Clique no link para ativar sua conta.`,
            duration: 8000, // Aumenta a duração para dar tempo de ler
         });
         navigate("/login"); // Redireciona para a página de login
      } catch (error) {
         if (error.code === "auth/email-already-in-use") {
            toast.error("E-mail já cadastrado.");
         } else if (error.code === "auth/invalid-email") {
            toast.error("E-mail inválido.");
         } else if (error.code === "auth/weak-password") {
            toast.error("A senha deve ter pelo menos 6 caracteres.");
         } else {
            toast.error("Erro ao criar conta. Tente novamente.");
         }
      }
   }

   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
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
                  disabled={loading}
               >
                  {loading ? "Criando conta..." : "Cadastrar"}
               </button>
            </form>
            <button
               className="mt-4 text-blue-600 underline w-full"
               onClick={() => navigate("/login")}
               disabled={loading}
            >
               Já tem conta? Entrar
            </button>
         </div>
      </div>
   );
}
