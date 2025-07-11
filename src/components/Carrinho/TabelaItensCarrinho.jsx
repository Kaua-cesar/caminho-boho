import { FaTrashAlt } from "react-icons/fa";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

export default function TabelaItensCarrinho({
   itens,
   atualizarQuantidade,
   removerDoCarrinho,
}) {
   return (
      <div className="overflow-x-auto border rounded-sm ">
         <div className="max-h-[390px] overflow-y-auto">
            <Table>
               <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                     <TableHead className="text-start w-[300px]">
                        Produto
                     </TableHead>
                     <TableHead className="text-center w-[200px]">
                        Quantidade
                     </TableHead>
                     <TableHead className="text-center w-[200px]">
                        Valor
                     </TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {itens.map((item, idx) => (
                     <TableRow
                        key={`${item.id}-${item.cor}-${item.tamanho}-${idx}`}
                     >
                        <TableCell className="flex flex-col gap-1">
                           <div className="flex items-center gap-4">
                              <img
                                 src={item.imagem}
                                 alt={item.nome}
                                 className="w-24 h-24 object-cover rounded"
                              />
                              <div>
                                 <span className="font-medium">
                                    {item.nome}
                                 </span>
                                 <div className="text-sm text-gray-600">
                                    {item.cor && <span>Cor: {item.cor} </span>}
                                    {item.tamanho && (
                                       <span> | Tamanho: {item.tamanho}</span>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </TableCell>

                        <TableCell className="text-center">
                           <div className="flex flex-col items-center justify-center gap-2">
                              <div className="flex items-center gap-2">
                                 <button
                                    className="px-2 py-1 border rounded-md cursor-pointer"
                                    onClick={() =>
                                       atualizarQuantidade(item, "subtrair")
                                    }
                                 >
                                    -
                                 </button>
                                 <span className="p-1">{item.quantidade}</span>
                                 <button
                                    className="px-2 py-1 border rounded-md cursor-pointer"
                                    onClick={() =>
                                       atualizarQuantidade(item, "somar")
                                    }
                                 >
                                    +
                                 </button>
                              </div>
                              <button
                                 onClick={() => removerDoCarrinho(item)}
                                 className="text-zinc-500 hover:text-red-500 hover:underline text-sm flex items-center gap-1 mt-1 cursor-pointer"
                              >
                                 <FaTrashAlt /> Remover
                              </button>
                           </div>
                        </TableCell>

                        <TableCell className="text-center">
                           R${(item.preco * item.quantidade).toFixed(2)}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
