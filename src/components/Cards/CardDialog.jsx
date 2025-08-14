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
   const { addItemToCart } = useCart();
   const [open, setOpen] = useState(false);
   const [corSelecionada, setCorSelecionada] = useState("");
   const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
   const [quantidade, setQuantidade] = useState(1);
   const [currentStock, setCurrentStock] = useState(0);

   // Função para verificar se o produto tem qualquer estoque
   const checkIfProductHasAnyStock = () => {
      if (!estoque) return false;

      // Caso sem variações (estoque é um número)
      if (cores.length === 0 && tamanhos.length === 0) {
         return Number(estoque) > 0;
      }

      // Caso com variações (estoque é um objeto)
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

   // Efeito para inicializar cor e tamanho quando o dialog abre
   useEffect(() => {
      if (!open || !productHasAnyStock) return;

      // Se há cores, mas nenhuma está selecionada
      if (cores.length > 0 && !corSelecionada) {
         for (const cor of cores) {
            // Encontra a primeira cor que tem algum estoque em qualquer tamanho
            if (tamanhos.some((t) => estoque[cor.nome]?.[t.nome] > 0)) {
               setCorSelecionada(cor.nome);
               break;
            }
         }
      }

      // Se há tamanhos, mas nenhum está selecionado E uma cor já foi selecionada
      if (tamanhos.length > 0 && corSelecionada && !tamanhoSelecionado) {
         for (const tamanho of tamanhos) {
            // Encontra o primeiro tamanho com estoque para a cor selecionada
            if (estoque[corSelecionada]?.[tamanho.nome] > 0) {
               setTamanhoSelecionado(tamanho.nome);
               break;
            }
         }
      }
   }, [
      open,
      productHasAnyStock,
      cores,
      tamanhos,
      estoque,
      corSelecionada,
      tamanhoSelecionado,
   ]);

   // Efeito para recalcular o estoque atual sempre que a cor ou o tamanho mudar
   useEffect(() => {
      if (!estoque) {
         setCurrentStock(0);
         return;
      }

      if (cores.length === 0 && tamanhos.length === 0) {
         setCurrentStock(Number(estoque) || 0);
         return;
      }

      if (corSelecionada && tamanhoSelecionado) {
         const stockForCombination =
            estoque[corSelecionada]?.[tamanhoSelecionado] || 0;
         setCurrentStock(stockForCombination);
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

   // Efeito para resetar a quantidade se o estoque mudar
   useEffect(() => {
      if (quantidade > currentStock) {
         setQuantidade(1);
      }
   }, [currentStock, quantidade]);

   const handleCorChange = (corNome) => {
      // Se a cor clicada for a mesma que a selecionada, deseleciona
      if (corSelecionada === corNome) {
         setCorSelecionada("");
         setTamanhoSelecionado(""); // Reseta o tamanho ao deselecionar a cor
      } else {
         setCorSelecionada(corNome);
         // Ao selecionar uma nova cor, tenta encontrar o primeiro tamanho com estoque
         let newTamanho = "";
         for (const tamanho of tamanhos) {
            if (estoque[corNome]?.[tamanho.nome] > 0) {
               newTamanho = tamanho.nome;
               break;
            }
         }
         setTamanhoSelecionado(newTamanho);
      }
      setQuantidade(1);
   };

   const handleTamanhoChange = (tamanhoNome) => {
      // Se o tamanho clicado for o mesmo que o selecionado, deseleciona
      if (tamanhoSelecionado === tamanhoNome) {
         setTamanhoSelecionado("");
      } else {
         setTamanhoSelecionado(tamanhoNome);
      }
      setQuantidade(1);
   };

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
            `Não há estoque suficiente para "${nome}". Disponível: ${currentStock}`
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

   // O botão só é habilitado se houver estoque para a combinação selecionada
   const isAddToCartButtonDisabled = currentStock <= 0 || quantidade <= 0;

   // Lógica aprimorada para a mensagem do botão
   let buttonMessage = "Adicionar ao carrinho";

   if (!productHasAnyStock) {
      buttonMessage = "Produto Indisponível";
   } else if (isVariationProduct) {
      if (!corSelecionada && cores.length > 0) {
         buttonMessage = "Selecione uma cor";
      } else if (!tamanhoSelecionado && tamanhos.length > 0) {
         buttonMessage = "Selecione um tamanho";
      } else if (currentStock <= 0) {
         buttonMessage = `Indisponível`;
      }
   }

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
                  <div className="cursor-pointer ">
                     <img
                        src={imagem}
                        alt={nome}
                        className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-80"
                     />

                     <div className=" absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
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
                     className="rounded-md md:w-100 h-158 object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-80"
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

                                 // Usando o colorClassMap aqui
                                 const colorClass =
                                    colorClassMap[cor.nome.toLowerCase()] ||
                                    "bg-gray-200";

                                 return (
                                    <button
                                       type="button"
                                       key={cor.nome}
                                       onClick={() => handleCorChange(cor.nome)}
                                       className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${colorClass} ${
                                          corSelecionada === cor.nome
                                             ? "border-black scale-110"
                                             : "border-gray-300"
                                       } ${
                                          isColorDisabled
                                             ? "opacity-50 cursor-not-allowed"
                                             : ""
                                       }`}
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
                                       onClick={() =>
                                          handleTamanhoChange(tamanho.nome)
                                       }
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
                                       aria-label={`Selecionar tamanho ${tamanho.nome}`}
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

                     {isVariationProduct && (
                        <p className="text-sm text-gray-600">
                           Estoque: {currentStock} unidades
                        </p>
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
                        disabled={
                           isAddToCartButtonDisabled ||
                           !corSelecionada ||
                           !tamanhoSelecionado
                        }
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

                     <p className="md:line-clamp-3 md:max-w-[530px] overflow-hidden break-words text-xs line-clamp-5 md:text-[16px]">
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
