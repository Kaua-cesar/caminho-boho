import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

export default function Login() {
   const { loginWithEmailPassword, loading, user, resendVerificationEmail } =
      useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [mostrarSenha, setMostrarSenha] = useState(false);

   const camposPreenchidos = email.trim() !== "" && senha.trim() !== "";

   useEffect(() => {
      if (location.state?.from) {
         toast.info("Você precisa fazer login para acessar esta página.");
      }
   }, [location.state]);

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
         console.log("Erro de login:", error.code);

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
            return;
         }

         switch (error.code) {
            case "auth/user-not-found":
               toast.error("Nenhuma conta encontrada com este e-mail.");
               break;
            case "auth/wrong-password":
               toast.error("Senha incorreta. Tente novamente.");
               break;
            case "auth/invalid-credential":
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

   return (
      <>
         {loading && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-[2px]">
               <span className="text-white text-2xl font-medium">
                  Verificando credenciais...
               </span>
            </div>
         )}

         <div className="p-6 flex h-screen justify-center items-center flex-col">
            <div className="flex md:border-1 rounded-xl border-0 flex-col-reverse md:flex-row">
               {/* Botão mobile */}
               <button
                  className="w-full border-1 md:border-2 md:py-2 py-4 rounded-md transition cursor-pointer md:hidden"
                  onClick={() => navigate("/register")}
                  type="button"
                  disabled={loading}
               >
                  Criar Conta
               </button>
               <div className="flex md:hidden items-center gap-4 mx-8 my-6">
                  <div className="flex-grow h-px bg-gray-300" />
                  <span className="text-gray-400 text-sm font-medium">ou</span>
                  <div className="flex-grow h-px bg-gray-300" />
               </div>

               <div className="md:mx-auto md:p-6 bg-white rounded flex flex-col gap-3 relative">
                  <h1 className="text-2xl font-medium mb-4 flex">
                     Entre ou cadastre-se
                  </h1>
                  <form onSubmit={handleSubmit} className="space-y-4 w-full">
                     <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 md:py-2 py-4"
                     />
                     <div className="relative w-full">
                        <input
                           type={mostrarSenha ? "text" : "password"}
                           placeholder="Senha"
                           value={senha}
                           onChange={(e) => setSenha(e.target.value)}
                           required
                           className="w-full border rounded px-3 md:py-2 py-4 pr-12"
                        />
                        {mostrarSenha ? (
                           <FaEye
                              onClick={() => setMostrarSenha(false)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                           />
                        ) : (
                           <FaEyeSlash
                              onClick={() => setMostrarSenha(true)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                           />
                        )}
                     </div>

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
                  <div className="hidden md:flex items-center gap-4 my-3 mx-4">
                     <div className="flex-grow h-px bg-gray-300" />
                     <span className="text-gray-400 text-sm font-medium">
                        ou
                     </span>
                     <div className="flex-grow h-px bg-gray-300" />
                  </div>
                  <button
                     className="border-2 py-2 rounded-md transition cursor-pointer md:flex hidden justify-center"
                     onClick={() => navigate("/register")}
                     type="button"
                     disabled={loading}
                  >
                     Criar Conta
                  </button>
               </div>
            </div>
            <span className="text-xs flex justify-center mt-12">
               © 2025 Caminho Boho. Todos os direitos reservados.
            </span>
         </div>
      </>
   );
}
