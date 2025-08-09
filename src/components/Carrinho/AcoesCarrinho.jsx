// src/components/Carrinho/AcoesCarrinhoFinish.jsx (se for um arquivo separado)
// OU no mesmo arquivo, mas com exportações nomeadas

import { Link } from "react-router-dom";

// Exportação nomeada para AcoesCarrinhoFinish
export function AcoesCarrinhoFinish() {
   return (
      <div className="flex flex-col items-center justify-center w-full ">
         <Link to="/finalizar-compra" className="w-full">
            <button className="w-full p-3 bg-amber-600 rounded-sm hover:bg-amber-700 text-white transition-colors duration-200 cursor-pointer">
               Finalizar compra
            </button>
         </Link>
      </div>
   );
}

// Exportação nomeada para AcoesCarrinhoContinue
export function AcoesCarrinhoContinue() {
   return (
      <div className="flex flex-col items-center justify-center w-auto   rounded-md">
         <Link
            to="/"
            className="w-full" // Garante que o link ocupe a largura total em telas pequenas
         >
            <button className=" w-full p-3 rounded-sm hover:underline cursor-pointer ">
               Continuar comprando
            </button>
         </Link>
      </div>
   );
}
