// src/Pages/Login.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Removidos FaFacebookF, FaApple, mantido FaEye, FaEyeSlash
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Footer } from "../components/Footer";
import { toast } from "sonner"; // Certifique-se de que sonner está instalado e configurado

export default function Login() {
   const {
      login: loginWithEmailPassword, // Renomeado para evitar conflito com 'loginWithProvider'
      loginWithProvider,
      loading,
      user,
   } = useAuth();
   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");

   const camposPreenchidos = email.trim() !== "" && senha.trim() !== "";
   const [mostrarSenha, setMostrarSenha] = useState(false);

   // Efeito para redirecionar após o login
   useEffect(() => {
      // console.log("Login.jsx useEffect: Estado atual do 'user':", user ? user.email : "NULO", " | Loading:", loading); // Removido
      // O `!loading` garante que o redirecionamento só aconteça depois que o onAuthStateChanged terminar.
      if (user && !loading) {
         // console.log("Usuário detectado em Login.jsx. Redirecionando para /minha-conta."); // Removido
         navigate("/minha-conta");
      }
   }, [user, navigate, loading]); // Adicionado 'loading' como dependência

   function handleSubmit(e) {
      e.preventDefault();
      // Aqui você chamaria uma função de login de e-mail/senha do Firebase se tivesse uma
      loginWithEmailPassword(email, senha); // Simulando login por e-mail/senha
      toast.success("Login com e-mail/senha simulado. Verifique o console.");
   }

   // Função genérica para os cliques dos botões de provedor social
   const handleSocialLoginClick = async (providerName) => {
      try {
         // console.log(`Chamando loginWithProvider para ${providerName}...`); // Removido
         const success = await loginWithProvider(providerName);
         if (success) {
            // Se o login foi bem-sucedido, o useEffect de cima cuidará do redirecionamento
            toast.success(`Login com ${providerName} bem-sucedido!`);
         } else {
            // Mensagem de erro mais genérica, pois o erro específico já foi logado no AuthContext
            toast.error(
               `Não foi possível iniciar o login com ${providerName}. Verifique o console para mais detalhes.`
            );
         }
      } catch (error) {
         // console.error(`Erro inesperado ao iniciar login com ${providerName}:`, error); // Removido
         toast.error(`Ocorreu um erro ao iniciar o login com ${providerName}.`);
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            Carregando autenticação...
         </div>
      );
   }

   return (
      <>
         <div className="min-h-screen flex flex-col">
            <div className="flex-grow flex justify-center items-center md:mt-52">
               <div className="flex gap-0 md:border-1 borde-black rounded-xl border-0 flex-col-reverse md:flex-row md:p-5">
                  <span className="text-xs flex justify-center mt-12 md:hidden">
                     © 2025 Caminho Boho. Todos os direitos reservados.
                  </span>
                  <div className="max-w-sm mx-6 p-6 bg-white rounded flex flex-col gap-8 md:gap-4 font-medium items-start">
                     <h1 className="text-2xl mb-4 md:flex hidden">
                        Entre ou cadastre-se
                     </h1>
                     <div className=" flex md:flex-col w-full md:gap-4 gap-8 justify-center">
                        {/* Botão Google */}
                        <button
                           type="button"
                           onClick={() => handleSocialLoginClick("google")}
                           className="w-15 h-15 rounded-full md:w-full bg-zinc-200 md:py-2 md:rounded-md hover:bg-zinc-300 transition cursor-pointer flex items-center justify-center gap-2"
                           disabled={loading}
                        >
                           <FcGoogle className="md:text-xl text-2xl" />
                           <span className="md:flex hidden">
                              Login com Google
                           </span>
                        </button>
                        {/* Removidos os botões de Facebook e Apple */}
                        <span className="text-xs md:flex hidden">
                           Associe uma conta de cada rede para acessar a Caminho
                           Boho.
                        </span>
                     </div>
                     <button className="w-full border-1 md:border-2 md:py-2 py-4 rounded-md transition cursor-pointer md:hidden">
                        Criar Conta
                     </button>
                  </div>
                  <div className="flex items-center gap-4 mx-12 md:mx-0">
                     <div className="flex-grow h-px bg-gray-300" />
                     <span className="text-gray-400 text-sm font-medium md:hidden">
                        ou
                     </span>
                     <div className="flex-grow h-px bg-gray-300 md:h-96 md:w-px" />
                  </div>
                  <div className="max-w-sm md:mx-auto mx-6 p-6 bg-white rounded flex flex-col gap-3">
                     <h1 className="text-2xl font-medium mb-4 md:flex hidden">
                        Entre ou cadastre-se
                     </h1>
                     <form onSubmit={handleSubmit} className="space-y-4 ">
                        <input
                           type="email"
                           placeholder="E-mail"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="w-full border rounded px-3 md:py-2 py-4"
                        />
                        <div className="relative w-80">
                           <input
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Senha"
                              value={senha}
                              onChange={(e) => setSenha(e.target.value)}
                              required
                              className="w-full border rounded px-3 md:py-2 py-4"
                           />
                           {mostrarSenha ? (
                              <FaEye
                                 onClick={() => setMostrarSenha(false)}
                                 className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                              />
                           ) : (
                              <FaEyeSlash
                                 onClick={() => setMostrarSenha(true)}
                                 className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                              />
                           )}
                        </div>
                        <span className="flex justify-center underline cursor-pointer md:hidden mb-8">
                           Esqueceu seus dados de acesso?
                        </span>
                        {camposPreenchidos ? (
                           <button
                              type="submit"
                              className="w-full bg-amber-600 text-white md:py-2 py-3 rounded-md hover:bg-amber-700 transition cursor-pointer"
                              disabled={loading}
                           >
                              Entrar
                           </button>
                        ) : (
                           <button
                              disabled
                              type="button"
                              className="w-full bg-zinc-400 text-white md:py-2 py-3 rounded-md transition"
                           >
                              Entrar
                           </button>
                        )}
                     </form>
                     <span className="md:flex justify-center underline cursor-pointer hidden">
                        Esqueceu seus dados de acesso?
                     </span>
                     <button className="mt-4 w-full border-2 py-2 rounded-md transition cursor-pointer md:flex hidden justify-center">
                        Criar Conta
                     </button>
                  </div>
               </div>
            </div>

            <div className="md:flex hidden">
               <Footer />
            </div>
         </div>
      </>
   );
}
