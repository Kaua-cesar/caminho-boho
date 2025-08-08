// src/Pages/Login.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Footer } from "../components/layout/Footer";
import { toast } from "sonner";

export default function Login() {
   const {
      loginWithEmailPassword,
      loginWithProvider,
      loading,
      user,
      resendVerificationEmail,
   } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [mostrarSenha, setMostrarSenha] = useState(false);

   const camposPreenchidos = email.trim() !== "" && senha.trim() !== "";

   // Alerta se veio de rota privada
   useEffect(() => {
      if (location.state?.from) {
         toast.info("Você precisa fazer login para acessar esta página.");
      }
   }, [location.state]);

   // Redireciona após login
   useEffect(() => {
      if (user && !loading) {
         const from = location.state?.from?.pathname || "/minha-conta";
         navigate(from, { replace: true });
      }
   }, [user, loading, navigate, location.state]);

   async function handleSubmit(e) {
      e.preventDefault();
      try {
         await loginWithEmailPassword(email, senha);
         toast.success("Login realizado com sucesso!");
      } catch (error) {
         console.log("Erro de login:", error.code); // Loga apenas o código do erro

         if (error.code === "auth/email-not-verified") {
            toast.error("Seu e-mail ainda não foi verificado.", {
               description:
                  "Por favor, verifique sua caixa de entrada ou clique para reenviar o e-mail.",
               action: {
                  label: "Reenviar e-mail",
                  onClick: () => resendVerificationEmail(error.user),
               },
               duration: 10000,
            });
            return; // Interrompe a execução para não mostrar outros toasts
         }

         switch (error.code) {
            case "auth/user-not-found":
               toast.error("Nenhuma conta encontrada com este e-mail.");
               break;
            case "auth/wrong-password":
               toast.error("Senha incorreta. Tente novamente.");
               break;
            case "auth/invalid-credential":
               // Este erro é mais genérico e seguro, usado nas versões mais recentes do Firebase.
               // Pode significar tanto e-mail não encontrado quanto senha incorreta.
               toast.error(
                  "Credenciais inválidas. Verifique o e-mail e a senha."
               );
               break;
            case "auth/invalid-email":
               toast.error("O formato do e-mail é inválido.");
               break;
            case "auth/too-many-requests":
               toast.error(
                  "Acesso bloqueado por muitas tentativas. Tente mais tarde."
               );
               break;
            default:
               toast.error("Erro ao tentar fazer login. Tente novamente.");
               break;
         }
      }
   }

   const handleSocialLoginClick = async (providerName) => {
      try {
         const success = await loginWithProvider(providerName);
         if (success) {
            toast.success(`Login com ${providerName} bem-sucedido!`);
         } else {
            toast.error(
               `Não foi possível iniciar o login com ${providerName}. Verifique o console para mais detalhes.`
            );
         }
      } catch (error) {
         toast.error(`Ocorreu um erro ao iniciar o login com ${providerName}.`);
      }
   };

   return (
      <>
         {/* Overlay global de loading */}
         {loading && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-[2px]">
               <span className="text-white text-2xl font-medium">
                  Verificando credenciais...
               </span>
            </div>
         )}

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
                     <div className="flex md:flex-col w-full md:gap-4 gap-8 justify-center">
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
                  <div className="max-w-sm md:mx-auto mx-6 p-6 bg-white rounded flex flex-col gap-3 relative">
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
                     <button
                        className="mt-4 w-full border-2 py-2 rounded-md transition cursor-pointer md:flex hidden justify-center"
                        onClick={() => navigate("/register")}
                        type="button"
                        disabled={loading}
                     >
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
