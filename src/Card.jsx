import React, { useState, useEffect } from "react";
import { CardDialog } from "./components/Cards/CardDialog";
import { CardButton } from "./components/Cards/CardButton"; // Assume que CardButton é um componente que recebe children e lida com estilos
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { toast } from "sonner";
import { IoHeartOutline } from "react-icons/io5"; // Adicionado para o botão de favorito

import { useCart } from "./context/CartContext";

export function Card({
   nome,
   // Garanta que preco e precoOriginal sejam sempre tratados como números
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
   atualizarTotalFavoritos, // Manter se for usado para favoritar no Card principal
}) {
   const checkIfProductHasAnyStock = () => {
      if (!estoque) return false;

      if (cores.length === 0 && tamanhos.length === 0) {
         return Number(estoque) > 0;
      }

      for (const cor of cores) {
         for (const tamanho of tamanhos) {
            if (estoque[cor.nome]?.[tamanho.nome] > 0) {
               return true;
            }
         }
      }
      return false;
   };

   const productHasAnyStock = checkIfProductHasAnyStock();

   const getInitialSelection = (options, stockData, parentSelection = null) => {
      if (options.length === 0) return "";

      for (const option of options) {
         if (parentSelection === null) {
            const hasStock = tamanhos.some(
               (t) => stockData[option.nome]?.[t.nome] > 0
            );
            if (hasStock) {
               return option.nome;
            }
         } else {
            if (stockData[parentSelection]?.[option.nome] > 0) {
               return option.nome;
            }
         }
      }
      return options[0]?.nome || "";
   };

   const [corSelecionada, setCorSelecionada] = useState(() =>
      getInitialSelection(cores, estoque)
   );
   const [tamanhoSelecionado, setTamanhoSelecionado] = useState(() =>
      getInitialSelection(tamanhos, estoque, corSelecionada)
   );
   const [currentStock, setCurrentStock] = useState(0);

   const { addItemToCart } = useCart();

   useEffect(() => {
      if (estoque && corSelecionada && tamanhoSelecionado) {
         const stockForCombination =
            estoque[corSelecionada]?.[tamanhoSelecionado] || 0;
         setCurrentStock(stockForCombination);
      } else if (cores.length === 0 && tamanhos.length === 0) {
         setCurrentStock(Number(estoque) || 0);
      } else {
         setCurrentStock(0);
      }
   }, [
      estoque,
      corSelecionada,
      tamanhoSelecionado,
      cores.length,
      tamanhos.length,
   ]);

   useEffect(() => {
      if (tamanhos.length > 0) {
         let newTamanho = "";
         if (corSelecionada) {
            for (const tamanho of tamanhos) {
               if (estoque[corSelecionada]?.[tamanho.nome] > 0) {
                  newTamanho = tamanho.nome;
                  break;
               }
            }
            if (
               tamanhoSelecionado &&
               estoque[corSelecionada]?.[tamanhoSelecionado] > 0
            ) {
               setTamanhoSelecionado(tamanhoSelecionado);
            } else {
               setTamanhoSelecionado(newTamanho || tamanhos[0]?.nome || "");
            }
         } else {
            setTamanhoSelecionado("");
         }
      }
   }, [corSelecionada, tamanhos, estoque, tamanhoSelecionado]);

   // ** SOLUÇÃO PARA O ERRO: Garantir que preco e precoOriginal sejam números **
   // Use Number() para tentar converter. Se for NaN (Not a Number), defina como 0.
   const numericPreco = Number(preco);
   const displayPreco = isNaN(numericPreco)
      ? "0.00"
      : numericPreco.toFixed(2).replace(".", ",");

   const numericPrecoOriginal = Number(precoOriginal);
   const displayPrecoOriginal = isNaN(numericPrecoOriginal)
      ? "0.00"
      : numericPrecoOriginal.toFixed(2).replace(".", ",");

   if (!nome || !imagem || isNaN(numericPreco)) return null; // Retorna null se o preço principal não for um número válido.

   async function handleAdicionarAoCarrinho() {
      toast.dismiss();

      const isVariationProduct = cores.length > 0 || tamanhos.length > 0;
      const isSelectionComplete =
         !isVariationProduct ||
         (cores.length > 0 &&
            corSelecionada &&
            tamanhos.length > 0 &&
            tamanhoSelecionado) ||
         (cores.length > 0 && corSelecionada && tamanhos.length === 0) ||
         (tamanhos.length > 0 && tamanhoSelecionado && cores.length === 0);

      if (isVariationProduct && !isSelectionComplete) {
         let message = "Por favor, ";
         if (
            cores.length > 0 &&
            !corSelecionada &&
            tamanhos.length > 0 &&
            !tamanhoSelecionado
         ) {
            message += "selecione uma cor e tamanho";
         } else if (cores.length > 0 && !corSelecionada) {
            message += "selecione uma cor";
         } else if (tamanhos.length > 0 && !tamanhoSelecionado) {
            message += "selecione um tamanho";
         }
         toast.error(message + " antes de adicionar ao carrinho.");
         return;
      }

      if (currentStock <= 0) {
         toast.error(
            `"${nome}" (${corSelecionada} / ${tamanhoSelecionado}) está indisponível no momento.`
         );
         return;
      }

      await addItemToCart({
         imagem,
         id,
         nome,
         preco: numericPreco, // Garante que o preco adicionado ao carrinho é um número
         cor: corSelecionada,
         tamanho: tamanhoSelecionado,
         quantidade: 1,
      });
   }

   const isVariationProduct = cores.length > 0 || tamanhos.length > 0;
   const isSelectionComplete =
      !isVariationProduct ||
      (cores.length > 0 &&
         corSelecionada &&
         tamanhos.length > 0 &&
         tamanhoSelecionado) ||
      (cores.length > 0 && corSelecionada && tamanhos.length === 0) ||
      (tamanhos.length > 0 && tamanhoSelecionado && cores.length === 0);

   let buttonMessage = "Adicionar ao carrinho";
   let isButtonDisabled = false;

   if (!productHasAnyStock) {
      buttonMessage = "Produto Indisponível";
      isButtonDisabled = true;
   } else if (isVariationProduct && !isSelectionComplete) {
      if (
         cores.length > 0 &&
         !corSelecionada &&
         tamanhos.length > 0 &&
         !tamanhoSelecionado
      ) {
         buttonMessage = "Selecione cor e tamanho";
      } else if (cores.length > 0 && !corSelecionada) {
         buttonMessage = "Selecione uma cor";
      } else if (tamanhos.length > 0 && !tamanhoSelecionado) {
         buttonMessage = "Selecione um tamanho";
      }
      isButtonDisabled = true;
   } else if (currentStock <= 0) {
      buttonMessage = `Indisponível (${corSelecionada || ""} ${
         tamanhoSelecionado || ""
      })`;
      isButtonDisabled = true;
   }

   return (
      <div className="w-full">
         <div className="bg-white rounded-md shadow-md overflow-hidden flex flex-col h-[650px] sm:h-[650px] lg:h-[650px] transition-transform duration-300 ease-in-out hover:scale-105 mx-auto max-w-xs">
            {desconto > 0 && (
               <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  -{desconto}%
               </span>
            )}

            <CardDialog
               id={id}
               nome={nome}
               preco={numericPreco} // Passa o valor numérico para CardDialog
               estoque={estoque}
               precoOriginal={numericPrecoOriginal} // Passa o valor numérico
               imagem={imagem}
               desconto={desconto}
               cores={cores}
               tamanhos={tamanhos}
               avaliacao={avaliacao}
               qntavaliacoes={qntavaliacoes}
               atualizarTotalFavoritos={atualizarTotalFavoritos}
            />
            <div className="p-3 flex flex-col flex-grow">
               <div className="flex items-center mb-1">
                  <Stack spacing={1} className="flex-shrink-0">
                     <Rating
                        name="half-rating-read"
                        className="rating-responsive"
                        size="small"
                        defaultValue={avaliacao}
                        precision={0.5}
                        readOnly
                     />
                  </Stack>
                  <span className="text-black/50 ml-2 text-xs flex-shrink-0">
                     {qntavaliacoes ? `( ${qntavaliacoes} )` : ""}{" "}
                  </span>
               </div>

               <h1 className="my-2 text-gray-800 text-base md:text-lg font-bold line-clamp-1 sm:min-h-[1rem] min-h-[2rem]">
                  {nome}
               </h1>

               <div className="flex flex-wrap gap-x-2 items-baseline mb-3">
                  <h2 className="text-amber-600 font-semibold text-lg sm:text-xl">
                     R${displayPreco} {/* **SOLUÇÃO APLICADA AQUI** */}
                  </h2>
                  {desconto && desconto !== 0 && (
                     <h2 className="text-gray-600 line-through text-sm sm:text-base">
                        R${displayPrecoOriginal}{" "}
                        {/* **SOLUÇÃO APLICADA AQUI** */}
                     </h2>
                  )}
               </div>

               {cores.length > 0 && (
                  <div className="mb-3">
                     <p className="text-sm text-gray-600 mb-1">
                        Cor:{" "}
                        <span className="font-medium">
                           {corSelecionada || "Nenhuma"}
                        </span>
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {" "}
                        {cores.map((cor) => {
                           const hasAnyStockForThisColor = tamanhos.some(
                              (tamanho) => estoque[cor.nome]?.[tamanho.nome] > 0
                           );
                           const isColorDisabled = !hasAnyStockForThisColor;

                           return (
                              <button
                                 key={cor.nome}
                                 onClick={() => {
                                    setCorSelecionada(
                                       corSelecionada === cor.nome
                                          ? ""
                                          : cor.nome
                                    );
                                 }}
                                 className={`
                                                w-6 h-6 md:w-7 md:h-7 rounded-full border-2 transition
                                                ${cor.classe}
                                                ${
                                                   corSelecionada === cor.nome
                                                      ? "border-black scale-110"
                                                      : "border-gray-300"
                                                }
                                                ${
                                                   isColorDisabled
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : "cursor-pointer"
                                                }
                                            `}
                                 title={cor.nome}
                                 aria-label={`Selecionar cor ${cor.nome}`}
                                 disabled={isColorDisabled}
                              ></button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {tamanhos.length > 0 && (
                  <div className="mb-4">
                     <p className="text-sm text-gray-600 mb-1">
                        Tamanho:{" "}
                        <span className="font-medium">
                           {tamanhoSelecionado || "Nenhum"}
                        </span>
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {" "}
                        {tamanhos.map((tamanho) => {
                           const stockForThisSize = corSelecionada
                              ? estoque[corSelecionada]?.[tamanho.nome] || 0
                              : 0;
                           const isSizeUnavailable = stockForThisSize === 0;

                           return (
                              <button
                                 key={tamanho.nome}
                                 onClick={() => {
                                    setTamanhoSelecionado(
                                       tamanhoSelecionado === tamanho.nome
                                          ? ""
                                          : tamanho.nome
                                    );
                                 }}
                                 className={`
                                                w-8 h-8 flex items-center justify-center border
                                                rounded-sm text-xs md:text-sm font-medium transition
                                                ${tamanho.classe || ""}
                                                ${
                                                   tamanhoSelecionado ===
                                                   tamanho.nome
                                                      ? "bg-black text-white"
                                                      : "border-gray-300 hover:bg-zinc-200/60"
                                                }
                                                ${
                                                   isSizeUnavailable ||
                                                   !corSelecionada
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : "cursor-pointer"
                                                }
                                            `}
                                 title={tamanho.nome}
                                 aria-label={`Selecionar tamanho ${tamanho.nome}`}
                                 disabled={isSizeUnavailable || !corSelecionada}
                              >
                                 {tamanho.nome}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}

               <div className="mt-auto">
                  {" "}
                  <CardButton
                     onClick={handleAdicionarAoCarrinho}
                     disabled={isButtonDisabled}
                  >
                     {buttonMessage}
                  </CardButton>
               </div>
            </div>
         </div>
      </div>
   );
}
