export default function ResumoCarrinho({ totalFinal }) {
   return (
      <div className="text-right">
         <p className="text-lg font-semibold text-amber-600">
            <span className="text-sm text-gray-600 mr-2">SubTotal:</span> R$
            <span className=" ml-1">
               {totalFinal.toFixed(2).replace(".", ",")}
            </span>
         </p>
      </div>
   );
}
