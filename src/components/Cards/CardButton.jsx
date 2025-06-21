import { RiShoppingCartFill } from "react-icons/ri";

export function CardButton({ onClick }) {
   return (
      <button
         onClick={onClick}
         className="mt-4 cursor-pointer bg-amber-600 hover:bg-amber-700 transition-colors text-white flex gap-2 p-2 items-center justify-center rounded-sm w-full"
      >
         <RiShoppingCartFill />
         Adicionar ao carrinho
      </button>
   );
}
