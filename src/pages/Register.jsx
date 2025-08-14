import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Função de validação de CPF real
const validateCpf = (cpf) => {
   cpf = cpf.replace(/\D/g, "");
   if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

   let sum = 0;
   let remainder;

   for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) remainder = 0;
   if (remainder !== parseInt(cpf[9])) return false;

   sum = 0;
   for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
   remainder = (sum * 10) % 11;
   if (remainder === 10 || remainder === 11) remainder = 0;
   if (remainder !== parseInt(cpf[10])) return false;

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

   const navigate = useNavigate();

   // Feedback visual instantâneo
   const [errors, setErrors] = useState({});

   const handleNameChange = (e) => {
      const value = e.target.value.replace(/[^a-zA-Z]/g, "");
      setName(value);
      if (value.length < 2)
         setErrors((prev) => ({
            ...prev,
            name: "Deve conter no mínimo 2 letras",
         }));
      else setErrors((prev) => ({ ...prev, name: null }));
   };

   const handleSobrenomeChange = (e) => {
      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
      setSobrenome(value);
      if (value.length < 2)
         setErrors((prev) => ({
            ...prev,
            sobrenome: "Deve conter no mínimo 2 letras",
         }));
      else setErrors((prev) => ({ ...prev, sobrenome: null }));
   };

   const handlePhoneChange = (e) => {
      const { value, selectionStart, selectionEnd } = e.target;
      const rawValue = value.replace(/\D/g, ""); // Apenas números
      let masked = "";

      if (rawValue.length > 0) masked = `(${rawValue.substring(0, 2)}`;
      if (rawValue.length >= 3) masked += `) ${rawValue.substring(2, 7)}`;
      if (rawValue.length >= 8) masked += `-${rawValue.substring(7, 11)}`;

      setTelefone(masked);

      // Ajusta a posição do cursor
      let newPos = selectionStart + (masked.length - value.length);
      if (newPos < 0) newPos = 0;
      e.target.setSelectionRange(newPos, newPos);
   };

   const handleCpfChange = (e) => {
      const { value, selectionStart, selectionEnd } = e.target;
      const rawValue = value.replace(/\D/g, ""); // Apenas números
      let masked = "";

      if (rawValue.length > 0) masked = rawValue.substring(0, 3);
      if (rawValue.length >= 4) masked += `.${rawValue.substring(3, 6)}`;
      if (rawValue.length >= 7) masked += `.${rawValue.substring(6, 9)}`;
      if (rawValue.length >= 10) masked += `-${rawValue.substring(9, 11)}`;

      setCpf(masked);

      // Ajusta a posição do cursor
      let newPos = selectionStart + (masked.length - value.length);
      if (newPos < 0) newPos = 0;
      e.target.setSelectionRange(newPos, newPos);

      // Validação instantânea
      if (rawValue.length === 11) {
         if (!validateCpf(rawValue)) {
            setErrors((prev) => ({ ...prev, cpf: "CPF inválido" }));
         } else {
            setErrors((prev) => ({ ...prev, cpf: null }));
         }
      } else {
         setErrors((prev) => ({ ...prev, cpf: "CPF incompleto" }));
      }
   };

   const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      if (!/\S+@\S+\.\S+/.test(value))
         setErrors((prev) => ({ ...prev, email: "Email inválido" }));
      else setErrors((prev) => ({ ...prev, email: null }));
   };

   const handlePasswordChange = (e) => {
      const value = e.target.value;
      setPassword(value);
      if (value.length < 8)
         setErrors((prev) => ({ ...prev, password: "Mínimo 8 caracteres" }));
      else if (!/(?=.*[A-Z])/.test(value))
         setErrors((prev) => ({
            ...prev,
            password: "Precisa de 1 letra maiúscula",
         }));
      else if (!/(?=.*[0-9])/.test(value))
         setErrors((prev) => ({ ...prev, password: "Precisa de 1 número" }));
      else setErrors((prev) => ({ ...prev, password: null }));
   };

   const handlePasswordConfirmationChange = (e) => {
      const value = e.target.value;
      setPasswordConfirmation(value);
      if (value !== password)
         setErrors((prev) => ({
            ...prev,
            passwordConfirmation: "Senhas não coincidem",
         }));
      else setErrors((prev) => ({ ...prev, passwordConfirmation: null }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      const unformattedTelefone = telefone.replace(/\D/g, "");
      const unformattedCpf = cpf.replace(/\D/g, "");

      if (!validateCpf(unformattedCpf)) {
         toast.error("CPF inválido.");
         setIsLoading(false);
         return;
      }

      if (
         !name ||
         !sobrenome ||
         !unformattedTelefone ||
         !unformattedCpf ||
         !email ||
         !password ||
         !passwordConfirmation
      ) {
         toast.error("Preencha todos os campos");
         setIsLoading(false);
         return;
      }

      if (Object.values(errors).some((err) => err)) {
         toast.error("Corrija os erros antes de enviar");
         setIsLoading(false);
         return;
      }

      try {
         const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/register`,
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  name: `${name.trim()} ${sobrenome.trim()}`,
                  email,
                  password,
                  cpf: unformattedCpf,
                  telefone: unformattedTelefone,
               }),
            }
         );

         if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Erro no registro");
         }

         await response.json();
         toast.success(
            "Registro realizado com sucesso! Verifique seu email (caixa principal ou spam)."
         );

         // Resetar campos
         setName("");
         setSobrenome("");
         setTelefone("");
         setCpf("");
         setEmail("");
         setPassword("");
         setPasswordConfirmation("");
         setErrors({});

         navigate("/login");
      } catch (err) {
         toast.error(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   const inputClass = (field) =>
      `shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
         errors[field] ? "border-red-500" : "border-gray-300"
      }`;

   return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
         <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg mt-[4.25rem]">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-6">
               Cadastre-se
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-1/2">
                     <label
                        className="block text-xs md:text-sm font-bold mb-1"
                        htmlFor="name"
                     >
                        Nome
                     </label>
                     <input
                        id="name"
                        type="text"
                        placeholder="Ana"
                        aria-label="Nome"
                        value={name}
                        onChange={handleNameChange}
                        className={inputClass("name")}
                     />
                     {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                     )}
                  </div>
                  <div className="w-full sm:w-1/2">
                     <label
                        className="block text-xs md:text-sm font-bold mb-1"
                        htmlFor="sobrenome"
                     >
                        Sobrenome
                     </label>
                     <input
                        id="sobrenome"
                        type="text"
                        placeholder="Claudia"
                        aria-label="Sobrenome"
                        value={sobrenome}
                        onChange={handleSobrenomeChange}
                        className={inputClass("sobrenome")}
                     />
                     {errors.sobrenome && (
                        <p className="text-red-500 text-xs">
                           {errors.sobrenome}
                        </p>
                     )}
                  </div>
               </div>

               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-1"
                     htmlFor="telefone"
                  >
                     Telefone
                  </label>
                  <input
                     id="telefone"
                     type="tel"
                     placeholder="(99) 99999-9999"
                     inputMode="numeric"
                     aria-label="Telefone"
                     value={telefone}
                     onChange={handlePhoneChange}
                     maxLength="15"
                     className={inputClass("telefone")}
                  />
                  {errors.telefone && (
                     <p className="text-red-500 text-xs">{errors.telefone}</p>
                  )}
               </div>

               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-1"
                     htmlFor="cpf"
                  >
                     CPF
                  </label>
                  <input
                     id="cpf"
                     type="text"
                     placeholder="000.000.000-00"
                     inputMode="numeric"
                     aria-label="CPF"
                     value={cpf}
                     onChange={handleCpfChange}
                     maxLength="14"
                     className={inputClass("cpf")}
                  />
                  {errors.cpf && (
                     <p className="text-red-500 text-xs">{errors.cpf}</p>
                  )}
               </div>

               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-1"
                     htmlFor="email"
                  >
                     Email
                  </label>
                  <input
                     id="email"
                     type="email"
                     placeholder="example@example.com"
                     aria-label="Email"
                     value={email}
                     onChange={handleEmailChange}
                     className={inputClass("email")}
                  />
                  {errors.email && (
                     <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
               </div>

               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-1"
                     htmlFor="password"
                  >
                     Senha
                  </label>
                  <input
                     id="password"
                     type="password"
                     placeholder="********"
                     aria-label="Senha"
                     value={password}
                     onChange={handlePasswordChange}
                     className={inputClass("password")}
                  />
                  {errors.password && (
                     <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
               </div>

               <div>
                  <label
                     className="block text-xs md:text-sm font-bold mb-1"
                     htmlFor="passwordConfirmation"
                  >
                     Confirmar Senha
                  </label>
                  <input
                     id="passwordConfirmation"
                     type="password"
                     placeholder="********"
                     aria-label="Confirmar Senha"
                     value={passwordConfirmation}
                     onChange={handlePasswordConfirmationChange}
                     className={inputClass("passwordConfirmation")}
                  />
                  {errors.passwordConfirmation && (
                     <p className="text-red-500 text-xs">
                        {errors.passwordConfirmation}
                     </p>
                  )}
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
