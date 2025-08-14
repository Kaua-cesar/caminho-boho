import React, { useState, useEffect } from "react";
import { CardDialog } from "./components/Cards/CardDialog";
import { CardButton } from "./components/Cards/CardButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { toast } from "sonner";
import { IoHeartOutline } from "react-icons/io5";

import { useCart } from "./context/CartContext";

// Objeto de mapeamento de cores
const colorClassMap = {
   vermelho: "bg-red-500",
   preto: "bg-gray-900",
   rosa: "bg-pink-500",
   azul: "bg-blue-500",
   branco: "bg-white border border-gray-300",
   verde: "bg-green-500",
   roxo: "bg-purple-500",
   amarelo: "bg-yellow-500",
   // Adicione mais cores conforme necessário
};

export function Card({
   nome,
   preco,
   precoOriginal,
   estoque,
   imagem,
   desconto,
   qntavaliacoes,
   avaliacao,
   id,
   atualizarTotalFavoritos,
}) {
   const cores = estoque ? Object.keys(estoque) : [];
   const tamanhosDisponiveis = ["PP", "P", "M", "G", "GG"];

   const getInitialCor = () => {
      if (!estoque) return "";
      return (
         cores.find((cor) =>
            tamanhosDisponiveis.some((tamanho) => estoque[cor]?.[tamanho] > 0)
         ) ||
         cores[0] ||
         ""
      );
   };

   const getInitialTamanho = (initialCor) => {
      if (!estoque || !initialCor) return "";
      return (
         tamanhosDisponiveis.find(
            (tamanho) => estoque[initialCor]?.[tamanho] > 0
         ) || ""
      );
   };

   const [corSelecionada, setCorSelecionada] = useState(getInitialCor);
   const [tamanhoSelecionado, setTamanhoSelecionado] = useState(() =>
      getInitialTamanho(corSelecionada)
   );
   const [currentStock, setCurrentStock] = useState(0);

   const { addItemToCart } = useCart();

   const checkIfProductHasAnyStock = () => {
      if (!estoque || Object.keys(estoque).length === 0) return false;

      return Object.values(estoque).some((tamanhos) =>
         Object.values(tamanhos).some((qnt) => qnt > 0)
      );
   };
   const productHasAnyStock = checkIfProductHasAnyStock();

   useEffect(() => {
      if (
         corSelecionada &&
         tamanhoSelecionado &&
         estoque &&
         estoque[corSelecionada]
      ) {
         setCurrentStock(estoque[corSelecionada][tamanhoSelecionado] || 0);
      } else {
         setCurrentStock(0);
      }
   }, [estoque, corSelecionada, tamanhoSelecionado]);

   useEffect(() => {
      if (corSelecionada) {
         const hasStockForCurrentTamanho =
            estoque[corSelecionada]?.[tamanhoSelecionado] > 0;
         if (!hasStockForCurrentTamanho) {
            const newTamanho = tamanhosDisponiveis.find(
               (tamanho) => estoque[corSelecionada]?.[tamanho] > 0
            );
            setTamanhoSelecionado(newTamanho || "");
         }
      } else {
         setTamanhoSelecionado("");
      }
   }, [corSelecionada, estoque, tamanhoSelecionado]);

   const numericPreco = Number(preco) || 0;
   const displayPreco = numericPreco.toFixed(2).replace(".", ",");
   const numericPrecoOriginal = Number(precoOriginal) || 0;
   const displayPrecoOriginal = numericPrecoOriginal
      .toFixed(2)
      .replace(".", ",");

   if (!nome || !imagem) return null;

   async function handleAdicionarAoCarrinho() {
      toast.dismiss();

      const isVariationProduct = cores.length > 0;
      const isSelectionComplete = isVariationProduct
         ? corSelecionada && tamanhoSelecionado
         : true;

      if (!isSelectionComplete) {
         toast.error(
            "Por favor, selecione uma cor e tamanho antes de adicionar ao carrinho."
         );
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
         preco: numericPreco,
         cor: corSelecionada,
         tamanho: tamanhoSelecionado,
         quantidade: 1,
      });
   }

   let buttonMessage = "Adicionar ao carrinho";
   let isButtonDisabled = false;

   if (!productHasAnyStock) {
      buttonMessage = "Produto Indisponível";
      isButtonDisabled = true;
   } else if (cores.length > 0 && (!corSelecionada || !tamanhoSelecionado)) {
      buttonMessage = "Selecione cor e tamanho";
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
               preco={numericPreco}
               estoque={estoque}
               precoOriginal={numericPrecoOriginal}
               imagem={imagem}
               desconto={desconto}
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
                     {qntavaliacoes ? `( ${qntavaliacoes} )` : ""}
                  </span>
               </div>

               <h1 className="my-2 text-gray-800 text-base md:text-lg font-bold line-clamp-1 sm:min-h-[1rem] min-h-[2rem]">
                  {nome}
               </h1>

               <div className="flex flex-wrap gap-x-2 items-baseline mb-3">
                  <h2 className="text-amber-600 font-semibold text-lg sm:text-xl">
                     R${displayPreco}
                  </h2>
                  {desconto > 0 && (
                     <h2 className="text-gray-600 line-through text-sm sm:text-base">
                        R${displayPrecoOriginal}
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
                        {cores.map((cor) => {
                           const hasAnyStockForThisColor =
                              tamanhosDisponiveis.some(
                                 (tamanho) => estoque[cor]?.[tamanho] > 0
                              );
                           const isColorDisabled = !hasAnyStockForThisColor;

                           const colorClass =
                              colorClassMap[cor.toLowerCase()] || "bg-gray-200";

                           return (
                              <button
                                 key={cor}
                                 onClick={() => {
                                    setCorSelecionada(
                                       corSelecionada === cor ? "" : cor
                                    );
                                 }}
                                 className={`
                                                w-6 h-6 md:w-7 md:h-7 rounded-full border-2 transition
                                                ${colorClass}
                                                ${
                                                   corSelecionada === cor
                                                      ? "border-black scale-110"
                                                      : "border-gray-300"
                                                }
                                                ${
                                                   isColorDisabled
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : "cursor-pointer"
                                                }
                                            `}
                                 title={cor}
                                 aria-label={`Selecionar cor ${cor}`}
                                 disabled={isColorDisabled}
                              />
                           );
                        })}
                     </div>
                  </div>
               )}

               {cores.length > 0 && (
                  <div className="mb-4">
                     <p className="text-sm text-gray-600 mb-1">
                        Tamanho:{" "}
                        <span className="font-medium">
                           {tamanhoSelecionado || "Nenhum"}
                        </span>
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {tamanhosDisponiveis.map((tamanho) => {
                           const stockForThisSize = corSelecionada
                              ? estoque[corSelecionada]?.[tamanho] || 0
                              : 0;
                           const isSizeUnavailable = stockForThisSize === 0;

                           return (
                              <button
                                 key={tamanho}
                                 onClick={() => {
                                    setTamanhoSelecionado(
                                       tamanhoSelecionado === tamanho
                                          ? ""
                                          : tamanho
                                    );
                                 }}
                                 className={`
                                                w-8 h-8 flex items-center justify-center border
                                                rounded-sm text-xs md:text-sm font-medium transition
                                                ${
                                                   tamanhoSelecionado ===
                                                   tamanho
                                                      ? "bg-black text-white"
                                                      : "border-gray-300 hover:bg-zinc-200/60"
                                                }
                                                ${
                                                   isSizeUnavailable
                                                      ? "opacity-50 cursor-not-allowed"
                                                      : "cursor-pointer"
                                                }
                                            `}
                                 title={tamanho}
                                 aria-label={`Selecionar tamanho ${tamanho}`}
                                 disabled={isSizeUnavailable}
                              >
                                 {tamanho}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}

               <div className="mt-auto">
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
