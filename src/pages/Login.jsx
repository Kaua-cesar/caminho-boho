import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Footer } from "../components/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
   const { login } = useAuth();
   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");

   const camposPreenchidos = email.trim() !== "" && senha.trim() !== "";
   const [mostrarSenha, setMostrarSenha] = useState(false);

   function handleSubmit(e) {
      e.preventDefault();
      login(email, senha);
      navigate("/minha-conta");
   }

   return (
      <>
         <div className="h-screen flex flex-col w-full justify-center ">
            <div className="flex justify-center ">
               <div className="flex gap-10 md:border-1 borde-black rounded-xl border-0 flex-col-reverse md:flex-row md:p-5">
                  <div className="max-w-sm  mx-6 p-6 bg-white rounded flex flex-col gap-12 md:gap-4 font-medium items-start">
                     <h1 className="text-2xl mb-4 md:flex hidden">
                        Entre ou cadastre-se
                     </h1>
                     <div className=" flex md:flex-col w-full md:gap-4 gap-8 justify-center">
                        <button
                           type="button"
                           className="w-15 h-15 rounded-full md:w-full bg-zinc-200  md:py-2 md:rounded-md hover:bg-zinc-300 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                           <FaFacebookF className="md:text-xl text-blue-900 text-2xl" />
                           <span className="md:flex hidden">
                              Login com Facebook
                           </span>
                        </button>
                        <button
                           type="button"
                           className="w-15 h-15 rounded-full md:md:w-full bg-zinc-200  md:py-2 md:rounded-md hover:bg-zinc-300 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                           <FaApple className="md:text-xl text-black text-2xl" />
                           <span className="md:flex hidden">
                              Login com Apple
                           </span>
                        </button>
                        <button
                           type="button"
                           className="w-15 h-15 rounded-full md:w-full bg-zinc-200  md:py-2 md:rounded-md hover:bg-zinc-300 transition cursor-pointer flex items-center justify-center gap-2"
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
                     <button className="mt-4 w-full border-1 md:border-2 md:py-2 py-4 rounded-md transition cursor-pointer md:hidden ">
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
                     <form onSubmit={handleSubmit} className="space-y-6 ">
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
                        <span className="flex justify-center underline cursor-pointer md:hidden mb-12">
                           Esqueceu seus dados de acesso?
                        </span>
                        {camposPreenchidos ? (
                           <button
                              type="button"
                              className="w-full bg-amber-600 text-white md:py-2 py-3 rounded-md hover:bg-amber-700 transition cursor-pointer"
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
         </div>
         <div className="md:flex hidden">
            <Footer />
         </div>
      </>
   );
}
