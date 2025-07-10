import { Link } from "react-router-dom";

export default function AcoesCarrinho() {
   return (
      <div className="flex items-center gap-4">
         <Link to="/" className="text-sm hover:underline text-gray-600">
            Continuar comprando
         </Link>
         <Link to="/finalizar-compra">
            <button className="p-3 bg-amber-600 rounded-sm hover:bg-amber-700 text-white cursor-pointer">
               Finalizar compra
            </button>
         </Link>
      </div>
   );
}
