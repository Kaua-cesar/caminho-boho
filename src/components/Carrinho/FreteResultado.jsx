// src/components/Carrinho/FreteResultado.jsx
import React from "react";

export default function FreteResultado({
   selectedFreteOptionInfo,
   availableFreteOptions,
   onSelectFreteOption,
   isLoading,
   error,
   cep, // Mantemos o CEP para a mensagem final, se precisar
}) {
   if (isLoading) {
      return (
         <p className="text-gray-600 text-sm mt-4 text-center md:text-left">
            Buscando opções de frete...
         </p>
      );
   }

   if (error) {
      return (
         <p className="text-red-500 text-sm mt-4 text-center md:text-left">
            {error}
         </p>
      );
   }

   // Filtrar opções por categoria
   const freteOptions = availableFreteOptions.filter(
      (option) => option.category === "frete"
   );
   const retiradaOptions = availableFreteOptions.filter(
      (option) => option.category === "retirada"
   );

   // Renderiza apenas se houver opções disponíveis ou se uma opção já foi selecionada
   if (
      freteOptions.length === 0 &&
      retiradaOptions.length === 0 &&
      !selectedFreteOptionInfo
   ) {
      return null; // Não renderiza nada se não houver opções e nenhuma selecionada
   }

   return (
      <div className=" md:mt-16">
         {freteOptions.length > 0 && (
            <div className="mb-6">
               <h3 className="text-lg font-semibold mb-3">Frete</h3>
               <div className="border border-gray-200 rounded-md overflow-hidden">
                  {freteOptions.map((option) => (
                     <label
                        key={option.id}
                        htmlFor={`frete-option-${option.id}`}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 
                            ${
                               selectedFreteOptionInfo &&
                               selectedFreteOptionInfo.id === option.id
                                  ? "bg-amber-50 border-amber-400"
                                  : "bg-white hover:bg-gray-50"
                            }
                            ${
                               option.id !==
                               freteOptions[freteOptions.length - 1].id
                                  ? "border-b border-gray-200"
                                  : ""
                            }`}
                     >
                        <div className="flex items-center">
                           <input
                              type="radio"
                              id={`frete-option-${option.id}`}
                              name="frete-option" // Mesmo nome para que apenas um seja selecionável
                              value={option.id}
                              checked={
                                 selectedFreteOptionInfo &&
                                 selectedFreteOptionInfo.id === option.id
                              }
                              onChange={() => onSelectFreteOption(option.id)}
                              className="mr-3 h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                           />
                           <div>
                              <p className="font-medium text-gray-800">
                                 {option.name}
                              </p>
                              {option.prazo && (
                                 <span className="text-sm text-gray-500">
                                    {option.prazo}
                                 </span>
                              )}
                           </div>
                        </div>
                        {option.value !== undefined && (
                           <span className="font-semibold text-gray-900">
                              R$ {option.value.toFixed(2).replace(".", ",")}
                           </span>
                        )}
                     </label>
                  ))}
               </div>
            </div>
         )}
         {/* Seção de Retirada */}
         {retiradaOptions.length > 0 && (
            <div>
               <h3 className="text-lg font-semibold mb-3">Retirada</h3>
               <div className="border border-gray-200 rounded-md overflow-hidden">
                  {retiradaOptions.map((option) => (
                     <label
                        key={option.id}
                        htmlFor={`frete-option-${option.id}`} // Mesmo nome 'frete-option'
                        className={`flex items-start justify-between p-4 cursor-pointer transition-colors duration-200 
                            ${
                               selectedFreteOptionInfo &&
                               selectedFreteOptionInfo.id === option.id
                                  ? "bg-amber-50 border-amber-400"
                                  : "bg-white hover:bg-gray-50"
                            }`}
                     >
                        <div className="flex items-center">
                           <input
                              type="radio"
                              id={`frete-option-${option.id}`}
                              name="frete-option" // Mesmo nome para que apenas um seja selecionável
                              value={option.id}
                              checked={
                                 selectedFreteOptionInfo &&
                                 selectedFreteOptionInfo.id === option.id
                              }
                              onChange={() => onSelectFreteOption(option.id)}
                              className="mr-3 h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500 mt-1"
                           />
                           <div>
                              <p className="font-medium text-gray-800">
                                 {option.name}
                              </p>
                              {option.address && ( // Exibir endereço para retirada
                                 <p className="text-sm text-gray-500">
                                    {option.address}
                                 </p>
                              )}
                           </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                           {option.value === 0
                              ? "Sem taxa"
                              : `R$ ${option.value
                                   .toFixed(2)
                                   .replace(".", ",")}`}
                        </span>
                     </label>
                  ))}
               </div>
            </div>
         )}
         {/* Mensagem de frete selecionado - opcional, se quiser um resumo à parte */}
         {/* Se desejar uma confirmação abaixo, pode descomentar e ajustar o estilo */}
         {/* {selectedFreteOptionInfo && (
          <div className="mt-6 p-3 border border-green-400 bg-green-50 rounded-md w-full text-center md:text-left">
            <p className="font-semibold text-green-700">Você escolheu:</p>
            <p className="text-gray-800 text-lg mt-1">
              <span className="font-bold">{selectedFreteOptionInfo.name}</span>
              {selectedFreteOptionInfo.value !== undefined && (
                <> - <span className="font-bold">R$ {selectedFreteOptionInfo.value.toFixed(2).replace(".", ",")}</span> </>
              )}
              {selectedFreteOptionInfo.prazo && (
                <span className="text-gray-600 text-base"> ({selectedFreteOptionInfo.prazo})</span>
              )}
            </p>
            {selectedFreteOptionInfo.carrier && (
              <p className="text-sm text-gray-600">Transportadora: {selectedFreteOptionInfo.carrier}</p>
            )}
          </div>
        )} */}
      </div>
   );
}
