// src/components/Carrinho/FreteCEP.jsx
import React from "react";

const formatCEP = (value) => {
   if (!value) return "";
   value = value.replace(/\D/g, "");
   if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
   }
   return value;
};

export default function FreteCEP({
   cep,
   handleChange,
   onCalculateFrete,
   isCalculatingFrete,
   hasValidCep,
}) {
   const handleInternalCEPChange = (e) => {
      const rawValue = e.target.value;
      handleChange(formatCEP(rawValue));
   };

   return (
      <div className="flex flex-col items-start gap-2 md:flex-wrap mb-14 md:mb-0 w-full md:w-auto">
         <p className="mr-3 w-48">Informe seu CEP</p>
         <div className="flex items-center gap-2 flex-wrap">
            <input
               type="text"
               value={cep}
               onChange={handleInternalCEPChange}
               maxLength={9}
               placeholder="00000-000"
               className="p-3 rounded-sm border w-34"
               inputMode="numeric"
            />
            <div className="relative inline-block">
               <button
                  onClick={onCalculateFrete}
                  disabled={!hasValidCep || isCalculatingFrete}
                  className={`cursor-pointer bg-amber-600 text-white p-3 rounded-md hover:bg-amber-700  ${
                     !hasValidCep || isCalculatingFrete
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                  }`}
               >
                  {isCalculatingFrete ? "Buscando..." : "Buscar Fretes"}
               </button>
               <span className="md:no-underline underline absolute left-1/2 -translate-x-1/2 mt-1 text-sm text-gray-600 top-full w-32 text-center hover:underline">
                  <a
                     href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Não sei meu CEP
                  </a>
               </span>
            </div>
         </div>
      </div>
   );
}
