import { useState } from "react";

export function AuthForm() {
   const [mode, setMode] = useState("login");

   return (
      <div className="p-6 rounded-md shadow-md bg-white w-full max-w-sm mx-auto">
         <h2 className="text-xl font-semibold mb-4">
            {mode === "login" ? "Login" : "Criar Conta"}
         </h2>

         <form className="space-y-4">
            <input
               type="email"
               placeholder="E-mail"
               className="w-full border px-3 py-2 rounded"
            />
            <input
               type="password"
               placeholder="Senha"
               className="w-full border px-3 py-2 rounded"
            />
            {mode === "register" && (
               <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full border px-3 py-2 rounded"
               />
            )}

            <button
               type="submit"
               className="w-full bg-black text-white py-2 rounded"
            >
               {mode === "login" ? "Entrar" : "Cadastrar"}
            </button>
         </form>

         <p className="text-sm text-center mt-4">
            {mode === "login" ? "Não tem conta?" : "Já tem uma conta?"}{" "}
            <button
               className="text-blue-600 underline"
               onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
               {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
         </p>
      </div>
   );
}
