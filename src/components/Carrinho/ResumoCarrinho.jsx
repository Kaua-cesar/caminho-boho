export default function ResumoCarrinho({ totalFinal }) {
   return (
      <div className="text-right">
         <p className="md:text-lg font-semibold text-amber-600 text-3xl ">
            <span className="md:text-sm text-xl text-gray-600 mr-2">
               SubTotal:
            </span>{" "}
            R$
            <span className="ml-1">
               {totalFinal.toFixed(2).replace(".", ",")}
            </span>
         </p>
      </div>
   );
}
