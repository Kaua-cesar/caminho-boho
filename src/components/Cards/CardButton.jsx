import { RiShoppingCartFill } from "react-icons/ri";
import { adicionarAoCarrinho } from "../../utils/carrinho";

export function CardButton({
   nome,
   preco,
   precoOriginal,
   estoque,
   cores = [],
   tamanhos = [],
   imagem,
   desconto,
   qntavaliacoes,
   avaliacao,
   id,
   atualizarTotalFavoritos, // << adicionar aqui
}) {
   return (
      <button
         className="flex justify-center w-full md:min-h-auto min-h-14 mt-4"
         onClick={() =>
            adicionarAoCarrinho({
               imagem: imagem,
               id: id,
               nome: nome,
               preco: Number(preco),
            })
         }
         disabled={Number(estoque) <= 0}
      >
         {Number(estoque) > 0 ? (
            <div className=" cursor-pointer bg-amber-600 hover:bg-amber-700 transition-colors md:text-[16px] text-sm text-white flex md:gap-2 p-2 items-center justify-center rounded-sm w-full">
               <RiShoppingCartFill className="md:text-xl text-2xl" />
               Adicionar ao carrinho
            </div>
         ) : (
            <div className=" bg-zinc-400  transition-colors text-white flex gap-2 p-2 items-center justify-center rounded-sm w-full md:text-[16px] text-sm">
               Indisponivel
            </div>
         )}
      </button>
   );
}
