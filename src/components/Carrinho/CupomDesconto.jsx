export default function CupomDesconto({ cupom, setCupom, aplicarCupom }) {
   return (
      <div className="flex gap-2 items-center md:mb-0 mb-8">
         <p className="md:text-xl text-sm uppercase font-bold md:mr-2 ">
            cupom de desconto:
         </p>
         <input
            type="text"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            maxLength={10}
            placeholder=""
            className="p-2 rounded-sm border md:w-40 w-34 uppercase"
            onKeyDown={(e) => {
               if (e.key === "Enter") {
                  aplicarCupom();
               }
            }}
         />
         <div className="flex-grow flex justify-between items-center gap-4 ">
            <div className="relative inline-block">
               <button
                  className="p-2 bg-amber-600 rounded-sm hover:bg-amber-700 text-white cursor-pointer w-30 "
                  onClick={aplicarCupom}
               >
                  <p>
                     <span className="inline">Usar cupom</span>
                  </p>
               </button>
            </div>
         </div>
      </div>
   );
}
