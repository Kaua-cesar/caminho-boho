import { FaSearchDollar, FaTruck } from "react-icons/fa";
export function InfoCarrinho() {
   return (
      <>
         <div className="flex justify-between flex-col md:flex-row gap-4 text-sm md:text-[16px]">
            <div>
               <p className="flex items-center gap-2 ">
                  <FaSearchDollar className="text-3xl text-amber-600 w-8 md:w-auto" />
                  Veja as formas de pagamento e parcelamento
               </p>
            </div>
         </div>
      </>
   );
}
