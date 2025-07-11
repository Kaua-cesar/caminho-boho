import { RiShoppingCartFill } from "react-icons/ri";
import { adicionarAoCarrinho } from "../../utils/carrinho";

export function CardButton({
   nome,
   preco,
   estoque,
   imagem,
   id,
   desativarClick = false,
   type = "button",
   onClick, // ✅ função externa (opcional)
}) {
   function handleClick() {
      if (desativarClick && typeof onClick === "function") {
         return onClick(); // chama o que veio de fora
      }
      if (!desativarClick) {
         adicionarAoCarrinho({
            imagem,
            id,
            nome,
            preco: Number(preco),
            cor: corSelecionada,
            tamanho: tamanhoSelecionado,
            quantidade,
         });
      }
   }

   return (
      <button
         type={type}
         className="flex justify-center w-full md:min-h-auto min-h-14 mt-4"
         onClick={handleClick}
         disabled={Number(estoque) <= 0}
      >
         {Number(estoque) > 0 ? (
            <div className="cursor-pointer bg-amber-600 hover:bg-amber-700 transition-colors md:text-[16px] text-sm text-white flex md:gap-2 p-2 items-center justify-center rounded-sm w-full">
               <RiShoppingCartFill className="md:text-xl text-2xl" />
               Adicionar ao carrinho
            </div>
         ) : (
            <div className=" bg-zinc-400  transition-colors text-white flex gap-2 p-2 items-center justify-center rounded-sm w-full md:text-[16px] text-sm">
               Indisponível
            </div>
         )}
      </button>
   );
}
