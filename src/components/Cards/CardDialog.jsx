import React, { useState, useEffect } from "react";
import { ContadorCliques } from "../ui/contador";
import { CardButton } from "./CardButton";
import { CardFavorits } from "./CardFavorits";
import { FaEye } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { FaBoxOpen } from "react-icons/fa6";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { useCart } from "../../context/CartContext";

export function CardDialog({
   id,
   nome,
   preco,
   precoOriginal,
   cores = [],
   tamanhos = [],
   imagem,
   desconto,
   estoque,
   qntavaliacoes,
   avaliacao,
   atualizarTotalFavoritos,
}) {
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
   const [quantidade, setQuantidade] = useState(1);
   const [open, setOpen] = useState(false);
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
   }, [corSelecionada, tamanhos, estoque]);

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

   async function handleSubmit(e) {
      e.preventDefault();

      toast.dismiss();

      let errorMessages = [];

      if (cores.length > 0 && !corSelecionada) {
         errorMessages.push("selecione uma cor");
      }
      if (tamanhos.length > 0 && !tamanhoSelecionado) {
         errorMessages.push("selecione um tamanho");
      }

      if (errorMessages.length > 0) {
         let message = "Por favor, ";
         if (errorMessages.length === 1) {
            message += errorMessages[0];
         } else {
            message +=
               errorMessages.slice(0, -1).join(", ") +
               " e " +
               errorMessages[errorMessages.length - 1];
         }
         toast.error(message + " antes de adicionar ao carrinho.");
         return;
      }

      if (currentStock < quantidade) {
         toast.error(
            `Não há estoque suficiente para "${nome}" (${corSelecionada} / ${tamanhoSelecionado}). Disponível: ${currentStock}`
         );
         return;
      }

      const productData = {
         imagem,
         id,
         nome,
         preco: Number(preco),
         cor: corSelecionada,
         tamanho: tamanhoSelecionado,
         quantidade: quantidade,
      };

      const success = await addItemToCart(productData);

      if (success) {
         setOpen(false);
      }
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

   // Determina se o botão principal de adicionar ao carrinho deve estar desabilitado
   const isAddToCartButtonDisabled =
      currentStock <= 0 || !isSelectionComplete || quantidade <= 0;

   // --- Lógica aprimorada para a mensagem do botão ---
   let buttonMessage = "Adicionar ao carrinho";

   if (isVariationProduct && !isSelectionComplete) {
      // Prioriza a mensagem de seleção se for um produto com variação e a seleção não estiver completa
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
   } else if (!productHasAnyStock) {
      // Se não tem estoque NENHUM, essa é a mensagem final
      buttonMessage = "Produto Indisponível";
   } else if (currentStock <= 0) {
      // Se a combinação selecionada está sem estoque
      buttonMessage = `Indisponível (${corSelecionada} / ${tamanhoSelecionado})`;
   }
   // --- Fim da lógica aprimorada ---

   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
            <div className="overflow-hidden rounded-t-md relative group ">
               <CardFavorits
                  produtoId={id}
                  desconto={desconto}
                  atualizarTotalFavoritos={atualizarTotalFavoritos}
               />
               <DialogTrigger asChild>
                  <div className="cursor-pointer">
                     <img
                        src={imagem}
                        alt={nome}
                        className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-80"
                     />

                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {productHasAnyStock ? (
                           <button className="bg-white text-black cursor-pointer p-3 rounded-md flex items-center gap-2 text-sm font-medium shadow">
                              <FaEye />
                              Veja Detalhes
                           </button>
                        ) : (
                           <button className="bg-red-500 text-white cursor-pointer p-3 rounded-md flex items-center gap-2 text-sm font-medium shadow">
                              <FaBoxOpen />
                              Fora de estoque
                           </button>
                        )}
                     </div>
                  </div>
               </DialogTrigger>
            </div>

            <DialogContent className="md:max-w-4xl flex w-screen">
               <div className="md:w-full relative cursor-pointer">
                  <img
                     src={imagem}
                     alt={nome}
                     className="rounded-md md:w-100 md:h-auto h-154 object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-80"
                  />
               </div>

               <DialogHeader className="md:w-380 w-35 h-full flex flex-col justify-between">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                     <DialogTitle className={"text-start"}>{nome}</DialogTitle>

                     <div className="flex text-yellow-500 items-center">
                        <Stack spacing={1}>
                           <Rating
                              name="half-rating-read"
                              className="rating-responsive-mobb"
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

                     <div className="flex gap-2 md:items-center items-start md:flex-row flex-col ">
                        <h2 className="text-amber-600 font-semibold md:text-2xl text-xl">
                           R${preco}
                        </h2>
                        {desconto && desconto !== 0 && (
                           <h2 className="md:text-sm text-gray-600 line-through text-xs">
                              R${precoOriginal}
                           </h2>
                        )}
                     </div>

                     {productHasAnyStock ? (
                        <span className="bg-green-200 text-green-900 rounded-2xl px-3 py-1 w-23 text-[10px] font-bold">
                           em estoque
                        </span>
                     ) : (
                        <span className="bg-red-200 text-red-900 rounded-2xl px-3 py-1 w-23 text-[10px] font-bold">
                           sem estoque
                        </span>
                     )}

                     {cores.length > 0 && (
                        <>
                           <p className="mt-2 text-sm text-gray-600 font-medium text-start">
                              Cor:{" "}
                              <span className="font-semibold">
                                 {corSelecionada || "Nenhuma selecionada"}
                              </span>
                           </p>
                           <div className="flex gap-3">
                              {cores.map((cor) => {
                                 const hasAnyStockForThisColor = tamanhos.some(
                                    (tamanho) =>
                                       estoque[cor.nome]?.[tamanho.nome] > 0
                                 );
                                 const isColorDisabled =
                                    !hasAnyStockForThisColor;

                                 return (
                                    <button
                                       type="button"
                                       key={cor.nome}
                                       onClick={() => {
                                          setCorSelecionada(
                                             corSelecionada === cor.nome
                                                ? ""
                                                : cor.nome
                                          );
                                          setQuantidade(1);
                                       }}
                                       className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                                          cor.classe
                                       } ${
                                          corSelecionada === cor.nome
                                             ? "border-black scale-110"
                                             : "border-gray-300"
                                       } ${
                                          isColorDisabled
                                             ? "opacity-50 cursor-not-allowed"
                                             : ""
                                       }`}
                                       title={cor.nome}
                                       disabled={isColorDisabled}
                                    ></button>
                                 );
                              })}
                           </div>
                        </>
                     )}

                     {tamanhos.length > 0 && (
                        <>
                           <p className="mt-2 text-sm text-gray-600 font-medium text-start">
                              Tamanho:{" "}
                              <span className="font-semibold">
                                 {tamanhoSelecionado || "Nenhum selecionado"}
                              </span>
                           </p>
                           <div className="flex gap-3 ">
                              {tamanhos.map((tamanho) => {
                                 const stockForThisSize = corSelecionada
                                    ? estoque[corSelecionada]?.[tamanho.nome] ||
                                      0
                                    : 0;
                                 const isSizeDisabled = stockForThisSize <= 0;

                                 return (
                                    <button
                                       type="button"
                                       key={tamanho.nome}
                                       onClick={() => {
                                          setTamanhoSelecionado(
                                             tamanhoSelecionado === tamanho.nome
                                                ? ""
                                                : tamanho.nome
                                          );
                                          setQuantidade(1);
                                       }}
                                       className={`w-8 h-8 rounded-sm border-1 transition text-xs md:text-sm cursor-pointer ${
                                          tamanho.classe || ""
                                       } ${
                                          tamanhoSelecionado === tamanho.nome
                                             ? "bg-black text-white"
                                             : "border-gray-300 hover:bg-zinc-200/60"
                                       } ${
                                          isSizeDisabled || !corSelecionada
                                             ? "opacity-50 cursor-not-allowed"
                                             : ""
                                       }`}
                                       title={tamanho.nome}
                                       disabled={
                                          isSizeDisabled || !corSelecionada
                                       }
                                    >
                                       {tamanho.nome}
                                    </button>
                                 );
                              })}
                           </div>
                        </>
                     )}

                     <p className="mt-2 text-sm text-gray-600 font-medium text-start">
                        Quantidade:
                     </p>
                     <ContadorCliques
                        value={quantidade}
                        onChange={setQuantidade}
                        max={currentStock}
                        disabled={isAddToCartButtonDisabled}
                     />

                     <CardButton
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isAddToCartButtonDisabled}
                     >
                        {buttonMessage}
                     </CardButton>

                     <Separator />

                     <div className="flex gap-5 font-medium mt-4 md:justify-start justify-center">
                        <button type="button" className="text-amber-600">
                           Descrição
                        </button>
                        <span className="md:flex hidden">
                           <button type="button">
                              Avaliações ({qntavaliacoes})
                           </button>
                        </span>
                     </div>

                     <p className="md:line-clamp-3 md:max-w-[530px] overflow-hidden break-words text-xs  line-clamp-5 md:text-[16px]">
                        Vestido Costa Nua Longo com diversos detalhes e etc
                        asdasd asdadasdasdasdasddasdasdsa...
                     </p>

                     <DialogDescription />
                  </form>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </>
   );
}
