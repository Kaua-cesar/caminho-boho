import { Link } from "react-router-dom";

export default function AcoesCarrinho() {
   return (
      <div className="flex items-center gap-4 md:flex-row flex-col  ">
         <Link
            to="/"
            className="text-sm hover:underline text-gray-600 md:no-underline underline"
         >
            Continuar comprando
         </Link>
         <Link to="/finalizar-compra">
            <button className="p-3 w-91 md:w-auto bg-amber-600 rounded-sm hover:bg-amber-700 text-white cursor-pointer md:mb-0 mb-20">
               Finalizar compra
            </button>
         </Link>
      </div>
   );
}
