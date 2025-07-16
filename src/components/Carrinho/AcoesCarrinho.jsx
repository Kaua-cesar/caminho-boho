import { Link } from "react-router-dom";

export default function AcoesCarrinho() {
   return (
      <div className="flex items-end gap-4 md:flex-row flex-col justify-center">
         <Link
            to="/"
            className="text-sm hover:underline text-gray-600 md:no-underline underline "
         >
            <button className="p-3 md:w-auto rounded-sm  cursor-pointer md:mb-0 mb-10 hover:underline">
               Continuar comprando
            </button>
         </Link>
         <Link to="/finalizar-compra">
            <button className="p-3  md:w-auto bg-amber-600 rounded-sm hover:bg-amber-700 text-white cursor-pointer md:mb-0 mb-10">
               Finalizar compra
            </button>
         </Link>
      </div>
   );
}
