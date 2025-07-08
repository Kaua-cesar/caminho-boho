import React, { useState } from "react";
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
   const [corSelecionada, setCorSelecionada] = useState("");
   const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
   const [quantidade, setQuantidade] = useState(1);
   const [open, setOpen] = useState(false);

   function handleSubmit(e) {
      e.preventDefault();
      if (tamanhoSelecionado && corSelecionada) {
         console.log(
            `Cor: ${corSelecionada}, Tamanho: ${tamanhoSelecionado}, Quantidade: ${quantidade}`
         );
         setOpen(false);
      } else {
         alert("Selecione uma cor e um tamanho antes de continuar.");
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
                  <div className="cursor-pointer">
                     <img
                        src={imagem}
                        alt={nome}
                        className="object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-80"
                     />

                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {Number(estoque) > 0 ? (
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
                     className=" rounded-md md:w-100 md:h-auto h-154 object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-80"
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

                     {Number(estoque) > 0 ? (
                        <span className="bg-green-200 text-green-900 rounded-2xl px-3 py-1 w-23 text-[10px] font-bold">
                           em estoque
                        </span>
                     ) : (
                        <span className="bg-red-200 text-red-900 rounded-2xl px-3 py-1 w-23 text-[10px] font-bold">
                           sem estoque
                        </span>
                     )}

                     <p className="mt-2 text-sm text-gray-600 font-medium text-start">
                        Cor:{" "}
                        <span className="font-semibold">{corSelecionada}</span>
                     </p>
                     <div className="flex gap-3">
                        {cores.map((cor) => (
                           <button
                              type="button"
                              key={cor.nome}
                              onClick={() =>
                                 setCorSelecionada((atual) =>
                                    atual === cor.nome ? "" : cor.nome
                                 )
                              }
                              className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                                 cor.classe
                              } ${
                                 corSelecionada === cor.nome
                                    ? "border-black scale-110"
                                    : "border-gray-300"
                              }`}
                              title={cor.nome}
                           ></button>
                        ))}
                     </div>

                     <p className="mt-2 text-sm text-gray-600 font-medium text-start">
                        Tamanho:{" "}
                        <span className="font-semibold">
                           {tamanhoSelecionado}
                        </span>
                     </p>
                     <div className="flex gap-3 ">
                        {tamanhos.map((tamanho) => (
                           <button
                              type="button"
                              key={tamanho.nome}
                              onClick={() =>
                                 setTamanhoSelecionado((atual) =>
                                    atual === tamanho.nome ? "" : tamanho.nome
                                 )
                              }
                              className={`w-8 h-8 rounded-sm border-1 transition text-xs md:text-sm cursor-pointer ${
                                 tamanho.classe || ""
                              } ${
                                 tamanhoSelecionado === tamanho.nome
                                    ? "bg-black text-white"
                                    : "border-gray-300 hover:bg-zinc-200/60"
                              }`}
                           >
                              {tamanho.nome}
                           </button>
                        ))}
                     </div>

                     <p className="mt-2 text-sm text-gray-600 font-medium text-start">
                        Quantidade:
                     </p>
                     <ContadorCliques
                        value={quantidade}
                        onChange={setQuantidade}
                     />

                     <CardButton type="submit" estoque={estoque} />

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
                  </form>{" "}
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </>
   );
}
