// src/pages/Register.jsx
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// FUNÇÃO DE VALIDAÇÃO DE CPF REAL
const validateCpf = (cpf) => {
   cpf = cpf.replace(/\D/g, "");
   if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
   }

   let sum = 0;
   let remainder;
   for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
   }
   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) {
      remainder = 0;
   }
   if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
   }

   sum = 0;
   for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
   }
   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) {
      remainder = 0;
   }
   if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false;
   }
   return true;
};

export default function Register() {
   const [name, setName] = useState("");
   const [sobrenome, setSobrenome] = useState("");
   const [telefone, setTelefone] = useState("");
   const [cpf, setCpf] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [passwordConfirmation, setPasswordConfirmation] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const { register } = useAuth();
   const navigate = useNavigate();

   const handleNameChange = (e) => {
      const filteredValue = e.target.value.replace(/[^a-zA-Z]/g, "");
      setName(filteredValue);
   };

   const handleSobrenomeChange = (e) => {
      const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
      setSobrenome(filteredValue);
   };

   const handlePhoneChange = (e) => {
      const { value, selectionStart } = e.target;
      const unformattedValue = value.replace(/\D/g, "");
      let formattedValue = "";

      if (unformattedValue.length > 0) {
         formattedValue = `(${unformattedValue.substring(0, 2)}`;
      }
      if (unformattedValue.length >= 3) {
         formattedValue += `) ${unformattedValue.substring(2, 7)}`;
      }
      if (unformattedValue.length >= 8) {
         formattedValue += `-${unformattedValue.substring(7, 11)}`;
      }

      if (unformattedValue.length > 11) {
         return;
      }

      setTelefone(formattedValue);

      const newCursorPosition =
         selectionStart + (formattedValue.length - value.length);
      e.target.setSelectionRange(newCursorPosition, newCursorPosition);
   };

   const handleCpfChange = (e) => {
      const { value, selectionStart } = e.target;
      const unformattedValue = value.replace(/\D/g, "");
      let formattedValue = "";

      if (unformattedValue.length > 0) {
         formattedValue = unformattedValue.substring(0, 3);
      }
      if (unformattedValue.length >= 4) {
         formattedValue += `.${unformattedValue.substring(3, 6)}`;
      }
      if (unformattedValue.length >= 7) {
         formattedValue += `.${unformattedValue.substring(6, 9)}`;
      }
      if (unformattedValue.length >= 10) {
         formattedValue += `-${unformattedValue.substring(9, 11)}`;
      }

      if (unformattedValue.length > 11) {
         return;
      }

      setCpf(formattedValue);

      const newCursorPosition =
         selectionStart + (formattedValue.length - value.length);
      e.target.setSelectionRange(newCursorPosition, newCursorPosition);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      const unformattedTelefone = telefone.replace(/\D/g, "");
      const unformattedCpf = cpf.replace(/\D/g, "");

      if (
         !name ||
         !sobrenome ||
         !unformattedTelefone ||
         !unformattedCpf ||
         !email ||
         !password ||
         !passwordConfirmation
      ) {
         toast.error("Por favor, preencha todos os campos.");
         setIsLoading(false);
         return;
      }

      if (name.trim().length < 2) {
         toast.error("O nome deve ter pelo menos 2 caracteres.");
         setIsLoading(false);
         return;
      }
      if (sobrenome.trim().length < 2) {
         toast.error("O sobrenome deve ter pelo menos 2 caracteres.");
         setIsLoading(false);
         return;
      }

      if (!validateCpf(unformattedCpf)) {
         toast.error("O CPF informado é inválido.");
         setIsLoading(false);
         return;
      }

      if (unformattedTelefone.length < 10 || unformattedTelefone.length > 11) {
         toast.error(
            "O telefone deve ter entre 10 e 11 dígitos (incluindo o DDD)."
         );
         setIsLoading(false);
         return;
      }

      if (password !== passwordConfirmation) {
         toast.error("As senhas não coincidem.");
         setIsLoading(false);
         return;
      }

      if (password.length < 8) {
         toast.error("A senha deve ter no mínimo 8 caracteres.");
         setIsLoading(false);
         return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).*$/;
      if (!passwordRegex.test(password)) {
         toast.error(
            "A senha deve conter pelo menos 1 letra maiúscula e 1 número."
         );
         setIsLoading(false);
         return;
      }

      try {
         await register(email, password, {
            nomeCompleto: `${name.trim()} ${sobrenome.trim()}`,
            telefone: unformattedTelefone,
            cpf: unformattedCpf,
         });

         toast.success("Conta criada! Verifique seu e-mail para fazer login.");
         navigate("/login");
      } catch (err) {
         console.error("Erro no registro:", err);
         toast.error(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center h-screen bg-gray-100 ">
         <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg ">
            {/* Título com tamanho de fonte responsivo */}
            <h2 className="text-xl md:text-3xl font-bold text-center mb-6">
               Cadastre-se
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-1/2">
                     {/* Rótulo com tamanho de fonte responsivo */}
                     <label
                        className="block text-xs md:text-sm font-bold mb-2"
                        htmlFor="name"
                     >
                        Nome
                     </label>
                     <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                     />
                  </div>
                  <div className="w-full sm:w-1/2">
                     {/* Rótulo com tamanho de fonte responsivo */}
                     <label
                        className="block text-xs md:text-sm font-bold mb-2"
                        htmlFor="sobrenome"
                     >
                        Sobrenome
                     </label>
                     <input
                        id="sobrenome"
                        type="text"
                        value={sobrenome}
                        onChange={handleSobrenomeChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                     />
                  </div>
               </div>
               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-2"
                     htmlFor="telefone"
                  >
                     Telefone
                  </label>
                  <input
                     id="telefone"
                     type="tel"
                     value={telefone}
                     onChange={handlePhoneChange}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     maxLength="15"
                     required
                  />
               </div>
               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-2"
                     htmlFor="cpf"
                  >
                     CPF
                  </label>
                  <input
                     id="cpf"
                     type="text"
                     value={cpf}
                     onChange={handleCpfChange}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     maxLength="14"
                     required
                  />
               </div>
               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-2"
                     htmlFor="email"
                  >
                     Email
                  </label>
                  <input
                     id="email"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     required
                  />
               </div>
               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-2"
                     htmlFor="password"
                  >
                     Senha
                  </label>
                  <input
                     id="password"
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     required
                  />
               </div>
               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-2"
                     htmlFor="passwordConfirmation"
                  >
                     Confirmar Senha
                  </label>
                  <input
                     id="passwordConfirmation"
                     type="password"
                     value={passwordConfirmation}
                     onChange={(e) => setPasswordConfirmation(e.target.value)}
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     required
                  />
               </div>
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
               >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
               </button>
            </form>
         </div>
      </div>
   );
}
