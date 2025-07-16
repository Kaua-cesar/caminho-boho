import React, { useState, useEffect } from "react";
import { CardDialog } from "./components/Cards/CardDialog";
import { CardButton } from "./components/Cards/CardButton";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { toast } from "sonner";

import { useCart } from "./context/CartContext";

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
   atualizarTotalFavoritos,
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
         // Para produtos simples, onde estoque é um número direto
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
               // Se o tamanho selecionado ainda tem estoque para a cor, mantém
               setTamanhoSelecionado(tamanhoSelecionado);
            } else {
               // Caso contrário, define o primeiro tamanho com estoque ou o primeiro tamanho
               setTamanhoSelecionado(newTamanho || tamanhos[0]?.nome || "");
            }
         } else {
            // Se nenhuma cor está selecionada, não deve ter um tamanho selecionado
            setTamanhoSelecionado("");
         }
      }
   }, [corSelecionada, tamanhos, estoque]);

   if (!nome || !imagem || !preco) return null;

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
         preco: Number(preco),
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

   // --- Lógica para a mensagem do botão no Card principal ---
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
         buttonMessage = "Selecione uma cor e tamanho";
      } else if (cores.length > 0 && !corSelecionada) {
         buttonMessage = "Selecione uma cor";
      } else if (tamanhos.length > 0 && !tamanhoSelecionado) {
         buttonMessage = "Selecione um tamanho";
      }
      isButtonDisabled = true; // Desabilita o botão se a seleção não estiver completa
   } else if (currentStock <= 0) {
      buttonMessage = `Indisponível (${corSelecionada || ""} ${
         tamanhoSelecionado || ""
      })`;
      isButtonDisabled = true;
   }
   // --- Fim da lógica da mensagem do botão no Card principal ---

   return (
      <div className="basis-1/6 flex justify-center items-center">
         <div className="w-80 max-w-full md:mx-0 shadow-md md:h-180 h-155 rounded-md flex-col flex transition-transform duration-300 ease-in-out">
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
               atualizarTotalFavoritos={atualizarTotalFavoritos}
            />
            <div className="p-3">
               <div className="flex">
                  <Stack spacing={1} className="">
                     <Rating
                        name="half-rating-read"
                        className="rating-responsive"
                        size="medium"
                        defaultValue={avaliacao}
                        precision={0.5}
                        readOnly
                     />
                  </Stack>
                  <span className="text-black/50 ml-2 text-xs md:text-[16px]">
                     {avaliacao ? `( ${avaliacao} )` : ""}
                  </span>
               </div>

               <h1 className="my-3 md:text-lg font-bold h-11 overflow-hidden line-clamp-2 md:overflow-visible ">
                  {nome}
               </h1>
               <div className="flex gap-2 items-center">
                  <h2 className=" text-amber-600 font-semibold md:text-2xl">
                     R${preco}
                  </h2>
                  {desconto && desconto !== 0 && (
                     <h2 className="md:text-sm text-gray-600 line-through text-xs">
                        R${precoOriginal}
                     </h2>
                  )}
               </div>

               {cores.length > 0 && (
                  <>
                     <p className="md:mt-4 mt-2 text-sm text-gray-600">
                        Cor:{" "}
                        <span className="font-medium">
                           {corSelecionada || "Nenhuma"}
                        </span>
                     </p>
                     <div className="flex gap-3 ">
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
                                 className={`md:w-7 md:h-7 rounded-full border-2 transition cursor-pointer w-6 h-6
                      ${cor.classe}
                      ${
                         corSelecionada === cor.nome
                            ? "border-black scale-110 "
                            : "border-gray-300"
                      }
                      ${isColorDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                                 title={cor.nome}
                                 aria-label={`Selecionar cor ${cor.nome}`}
                                 disabled={isColorDisabled}
                              ></button>
                           );
                        })}
                     </div>
                  </>
               )}

               {tamanhos.length > 0 && (
                  <>
                     <p className="md:mt-4 mt-2 text-sm text-gray-600">
                        Tamanho:{" "}
                        <span className="font-medium">
                           {tamanhoSelecionado || "Nenhum"}
                        </span>
                     </p>
                     <div className="flex gap-3 ">
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
                                 className={`md:w-8 md:h-8 rounded-sm border-1 transition md:text-sm cursor-pointer w-6 h-6 text-xs
                        ${tamanho.classe || ""}
                        ${
                           tamanhoSelecionado === tamanho.nome
                              ? "bg-black text-white "
                              : "border-gray-300 hover:bg-zinc-200/60"
                        }
                        ${
                           isSizeUnavailable || !corSelecionada
                              ? "opacity-50 cursor-not-allowed"
                              : ""
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
                  </>
               )}

               <CardButton
                  onClick={handleAdicionarAoCarrinho}
                  disabled={isButtonDisabled}
               >
                  {buttonMessage}
               </CardButton>
            </div>
         </div>
      </div>
   );
}
