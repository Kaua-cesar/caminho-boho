import { RiShoppingCartFill } from "react-icons/ri";

export function CardButton({
   type = "button",
   onClick,
   disabled = false,
   children, // ✨ NOVO: Adicionado 'children' para renderizar o conteúdo passado
}) {
   return (
      <button
         type={type}
         className="flex justify-center w-full md:min-h-auto min-h-14 mt-4"
         onClick={onClick}
         disabled={disabled}
      >
         {/* ✨ Removida a lógica interna de texto. Agora, renderiza 'children'. */}
         {/* A classe de estilo também será ajustada via TailwindCSS para refletir o estado 'disabled' */}
         <div
            className={`flex md:gap-2 p-2 items-center justify-center rounded-sm w-full md:text-[16px] text-sm
          ${
             disabled
                ? "bg-zinc-400 cursor-not-allowed" // Estilo para desabilitado
                : "bg-amber-600 hover:bg-amber-700 cursor-pointer" // Estilo para habilitado
          }
          transition-colors text-white
        `}
         >
            <RiShoppingCartFill className="md:text-xl text-2xl" />
            {children}
            {/* ✨ O texto do botão vem de fora, do componente pai */}
         </div>
      </button>
   );
}
