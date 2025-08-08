export default function ResumoCarrinho({ totalFinal }) {
   return (
      <div className="text-right">
         <p className="lg:text-4xl font-semibold text-amber-600  md:text-3xl text-3xl">
            <span className=" text-gray-600 mr-2 lg:text-2xl md:text-2xl">
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
