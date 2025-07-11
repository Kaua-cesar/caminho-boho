import { FaSearchDollar, FaTruck } from "react-icons/fa";
export function InfoCarrinho() {
   return (
      <>
         <div className="flex justify-between flex-col md:flex-row gap-4 mb-6 text-sm md:text-[16px]">
            <div>
               <p className="flex items-center gap-2 ">
                  <FaSearchDollar className="text-3xl text-amber-600 w-8 md:w-auto" />
                  Ver as formas de pagamento e parcelamento
               </p>
               <p className="flex items-center gap-2 ">
                  <FaTruck className="text-3xl text-amber-600 w-11 md:w-auto" />
                  Preencha o campo CEP para calcular o valor do frete e o prazo
               </p>
            </div>
         </div>
      </>
   );
}
