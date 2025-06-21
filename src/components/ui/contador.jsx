import React from "react";

export function ContadorCliques({ value, onChange }) {
   const handleIncrement = (e) => {
      e.stopPropagation();
      if (value < 10) {
         onChange(value + 1);
      } else {
         alert("Quantidade máxima atingida.");
      }
   };

   const handleDecrement = (e) => {
      e.stopPropagation();
      if (value > 1) {
         onChange(value - 1);
      }
   };

   return (
      <div className="text-center flex gap-3">
         <button
            type="button"
            onClick={handleDecrement}
            className="border-1 border-zinc-400/50 hover:bg-zinc-200/60 px-4 cursor-pointer rounded-sm"
         >
            -
         </button>
         <p className="p-2">{value}</p>
         <button
            type="button"
            onClick={handleIncrement}
            className="border-1 border-zinc-400/50 hover:bg-zinc-200/60 px-4 cursor-pointer rounded-sm"
         >
            +
         </button>
      </div>
   );
}
