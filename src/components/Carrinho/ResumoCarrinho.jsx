import React from "react";
import { Separator } from "@/components/ui/separator";

function ResumoCarrinho({
   totalItens,
   valorFrete,
   totalFinal,
   descontoPercentual,
   cuponsAplicados,
}) {
   const valorDesconto = totalItens * descontoPercentual;

   // Função para formatar o valor como moeda brasileira
   const formatarMoeda = (valor) => {
      return valor.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL",
      });
   };

   return (
      <div className="text-right">
         <div className="flex flex-col gap-2 text-md">
            <div className="flex justify-between">
               <span className="text-gray-600 mr-2">Subtotal (Produtos): </span>
               <span className="font-semibold">
                  {formatarMoeda(totalItens)}
               </span>
            </div>

            {cuponsAplicados.length > 0 && (
               <div className="flex justify-between text-red-600">
                  <span className="text-gray-600">Cupons:</span>
                  <span className="font-semibold">
                     - {formatarMoeda(valorDesconto)}
                  </span>
               </div>
            )}

            <div className="flex justify-between">
               <span className="text-gray-600">Frete:</span>
               <span className="font-semibold">
                  {valorFrete === 0
                     ? "Grátis"
                     : valorFrete
                     ? formatarMoeda(valorFrete)
                     : "A calcular"}
               </span>
            </div>
         </div>

         <Separator className="my-4 bg-gray-300" />

         <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>{formatarMoeda(totalFinal)}</span>
         </div>
      </div>
   );
}

export default ResumoCarrinho;
