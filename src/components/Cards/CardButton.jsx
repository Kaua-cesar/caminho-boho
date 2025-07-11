// src/components/CardButton.jsx
import { RiShoppingCartFill } from "react-icons/ri";
// Não precisamos do useCart aqui, pois a lógica de adicionar
// será tratada pelo componente pai (CardDialog)
// import { useCart } from "../../context/CartContext";

export function CardButton({
   estoque,
   type = "button", // Manter type como "button" por padrão é bom para reuso
   onClick, // ✅ A função externa que o pai (CardDialog) passa
   // Removendo props não usadas diretamente pelo CardButton para addItemToCart
   // id, nome, preco, imagem, corSelecionada, tamanhoSelecionado, quantidade
}) {
   // Não precisamos de handleClick interno que chame addItemToCart diretamente.
   // O onClick do pai (handleSubmit) já fará isso.

   return (
      <button
         // IMPORTANTE: Definir o tipo como "submit" para que o formulário seja submetido
         // A menos que você tenha uma boa razão para que ele seja "button" e chame onClick.
         // Para o CardDialog, ele DEVE ser "submit".
         type={type} // Permite que o pai decida se é 'button' ou 'submit'
         className="flex justify-center w-full md:min-h-auto min-h-14 mt-4"
         onClick={onClick} // Passa o onClick recebido diretamente para o botão
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
