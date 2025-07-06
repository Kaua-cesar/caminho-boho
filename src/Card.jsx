import React, { useState } from "react";
import { CardDialog } from "./components/Cards/CardDialog";
import { CardButton } from "./components/Cards/CardButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

export function Card({
   nome,
   preco,
   precoOriginal,
   estoque,
   cores = [],
   tamanhos = [],
   imagem,
   desconto,
   qntavaliacoes,
   avaliacao,
   id,
   atualizarTotalFavoritos, // << adicionar aqui
}) {
   const [corSelecionada, setCorSelecionada] = useState("");
   const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");

   if (!nome || !imagem || !preco) return null; // proteção

   return (
      <div className="basis-1/6 flex justify-center items-center">
         <div className="w-80 max-w-full shadow-md h-180 rounded-md flex-col flex transition-transform duration-300 ease-in-out">
            <CardDialog
               id={id}
               nome={nome}
               preco={preco}
               estoque={estoque}
               precoOriginal={precoOriginal}
               imagem={imagem}
               desconto={desconto}
               cores={cores}
               tamanhos={tamanhos}
               avaliacao={avaliacao}
               qntavaliacoes={qntavaliacoes}
               atualizarTotalFavoritos={atualizarTotalFavoritos} // << adicionar aqui
            />
            <div className="p-3">
               <div className="flex text-yellow-500 items-center">
                  <Stack spacing={1}>
                     <Rating
                        name="half-rating-read"
                        size="medium"
                        defaultValue={avaliacao}
                        precision={0.5}
                        readOnly
                     />
                  </Stack>
                  <span className="text-black/50 ml-2">
                     {avaliacao ? `( ${avaliacao} )` : ""}
                  </span>
               </div>

               <h1 className="my-3 text-lg font-bold h-10 flex items-center ">
                  {nome}
               </h1>
               <div className="flex gap-2 items-center">
                  <h2 className=" text-amber-600 font-semibold text-2xl">
                     R${preco}
                  </h2>
                  {desconto && desconto !== 0 && (
                     <h2 className="text-sm text-gray-600 line-through">
                        R${precoOriginal}
                     </h2>
                  )}
               </div>

               {cores.length > 0 && (
                  <>
                     <p className="mt-4 text-sm text-gray-600">
                        Cor:{" "}
                        <span className="font-medium">
                           {corSelecionada ? corSelecionada : ""}
                        </span>
                     </p>
                     <div className="flex gap-3 ">
                        {cores.map((cor) => (
                           <button
                              key={cor.nome}
                              onClick={() =>
                                 setCorSelecionada((atual) =>
                                    atual === cor.nome ? "" : cor.nome
                                 )
                              }
                              className={`w-7 h-7 rounded-full border-2 transition cursor-pointer
                                 ${cor.classe} 
                                 ${
                                    corSelecionada === cor.nome
                                       ? "border-black scale-110 "
                                       : "border-gray-300"
                                 }`}
                              title={cor.nome}
                           ></button>
                        ))}
                     </div>
                  </>
               )}

               {tamanhos.length > 0 && (
                  <>
                     <p className="mt-4 text-sm text-gray-600">
                        Tamanho:{" "}
                        <span className="font-medium">
                           {tamanhoSelecionado ? tamanhoSelecionado : ""}
                        </span>
                     </p>
                     <div className="flex gap-3 ">
                        {tamanhos.map((tamanho) => (
                           <button
                              key={tamanho.nome}
                              onClick={() =>
                                 setTamanhoSelecionado((atual) =>
                                    atual === tamanho.nome ? "" : tamanho.nome
                                 )
                              }
                              className={`w-8 h-8 rounded-sm border-1 transition text-sm cursor-pointer 
                                 ${tamanho.classe || ""} 
                                 ${
                                    tamanhoSelecionado === tamanho.nome
                                       ? "bg-black text-white "
                                       : "border-gray-300 hover:bg-zinc-200/60"
                                 }`}
                           >
                              {tamanho.nome}
                           </button>
                        ))}
                     </div>
                     <CardButton estoque={estoque} />
                  </>
               )}
            </div>
         </div>
      </div>
   );
}
