import { RiShoppingCartFill } from "react-icons/ri";

export function CardButton({
   type = "button",
   onClick,
   disabled = false,
   children,
}) {
   return (
      <button
         type={type}
         className="flex justify-center w-full md:min-h-auto min-h-14 mt-4"
         onClick={onClick}
         disabled={disabled}
      >
         <div
            className={`flex md:gap-2 p-2 items-center justify-center rounded-sm w-full md:text-[16px] text-sm
          ${
             disabled
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
          }
          transition-colors text-white
        `}
         >
            <RiShoppingCartFill className="md:text-xl text-2xl " />
            {children}
         </div>
      </button>
   );
}
