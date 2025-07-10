export default function CupomDesconto({
   cupom,
   setCupom,
   aplicarCupom,
   mensagem,
}) {
   return (
      <div className="flex gap-2 items-center">
         <p className="text-xl uppercase font-bold mr-2">cupom de desconto:</p>
         <input
            type="text"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            maxLength={10}
            placeholder=""
            className="p-2 rounded-sm border w-40 uppercase"
         />
         <div className="flex-grow flex justify-between items-center gap-4 ">
            <div className="relative inline-block">
               <button
                  className="p-2  bg-amber-600 rounded-sm hover:bg-amber-700 text-white cursor-pointer"
                  onClick={aplicarCupom}
               >
                  Usar cupom
               </button>

               {mensagem && (
                  <p className="text-sm absolute mt-1 w-60 font-medium">
                     {mensagem}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}
