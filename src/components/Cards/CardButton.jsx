import { RiShoppingCartFill } from "react-icons/ri";

export function CardButton({ onClick, estoque }) {
   return (
      <button
         className="flex justify-center w-full mt-4"
         onClick={onClick}
         disabled={Number(estoque) <= 0}
      >
         {Number(estoque) > 0 ? (
            <div className=" cursor-pointer bg-amber-600 hover:bg-amber-700 transition-colors text-white flex gap-2 p-2 items-center justify-center rounded-sm w-full">
               <RiShoppingCartFill />
               Adicionar ao estoque
            </div>
         ) : (
            <div className=" bg-zinc-400  transition-colors text-white flex gap-2 p-2 items-center justify-center rounded-sm w-full">
               Indisponivel
            </div>
         )}
      </button>
   );
}
