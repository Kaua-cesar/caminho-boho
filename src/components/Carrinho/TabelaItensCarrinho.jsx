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
   const coresCSS = {
      azul: "blue",
      vermelho: "red",
      verde: "green",
      preto: "black",
      branco: "gray",
      cinza: "gray",
      rosa: "pink",
      bege: "#f5f5dc",
      amarelo: "#b59f00",
      roxo: "purple",
      laranja: "orange",
   };

   return (
      // Removemos as classes de rolagem daqui
      <div className="overflow-x-auto">
         <Table>
            {/* As classes sticky top-0 bg-white z-10 estão corretas aqui */}
            <TableHeader className="sticky top-0 bg-white z-10">
               <TableRow>
                  <TableHead className="text-start w-[300px]">
                     Produto
                  </TableHead>
                  <TableHead className="text-center w-[200px]">
                     Quantidade
                  </TableHead>
                  <TableHead className="text-center w-[200px]">Valor</TableHead>
               </TableRow>
            </TableHeader>

            <TableBody>
               {itens.map((item, idx) => (
                  <TableRow
                     key={`${item.id}-${item.cor}-${item.tamanho}-${idx}`}
                  >
                     <TableCell className="flex flex-col gap-1 w-42 md:w-auto">
                        <div className="flex items-center gap-4">
                           <img
                              src={item.imagem}
                              alt={item.nome}
                              className="w-24 h-24 object-cover rounded"
                           />
                           <div className="w-32 md:w-auto overflow-hidden">
                              <span className="font-medium text-sm block break-words md:break-normal whitespace-normal mb-1 md:mb-0">
                                 {item.nome}
                              </span>
                              <div className="md:text-sm text-xs text-gray-600 whitespace-normal flex md:flex-row flex-col gap-1">
                                 {item.cor && (
                                    <div>
                                       Cor:{" "}
                                       <span
                                          style={{
                                             color:
                                                coresCSS[
                                                   item.cor?.toLowerCase()
                                                ] || "inherit",
                                          }}
                                       >
                                          {item.cor}
                                       </span>
                                    </div>
                                 )}
                                 {item.tamanho && (
                                    <div className="flex flex-row items-center">
                                       <span className="md:block hidden">
                                          | Tamanho:&nbsp;
                                       </span>
                                       <span className="md:hidden">
                                          Tamanho:&nbsp;
                                       </span>
                                       <span className="font-semibold">
                                          {item.tamanho}
                                       </span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </TableCell>

                     <TableCell className="text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <div className="flex items-center gap-2">
                              <button
                                 className="md:px-2 px-1 py-1 border rounded-md cursor-pointer"
                                 onClick={() =>
                                    atualizarQuantidade(item, "subtrair")
                                 }
                              >
                                 -
                              </button>
                              <span className="p-1">{item.quantidade}</span>
                              <button
                                 className="md:px-2 px-1 py-1 border rounded-md cursor-pointer"
                                 onClick={() =>
                                    atualizarQuantidade(item, "somar")
                                 }
                              >
                                 +
                              </button>
                           </div>
                           <button
                              onClick={() => removerDoCarrinho(item)}
                              className="text-zinc-500 hover:text-red-500 hover:underline md:text-sm flex items-center gap-1 mt-1 cursor-pointer text-xs"
                           >
                              <FaTrashAlt />{" "}
                              <p className="md:no-underline underline">
                                 Remover
                              </p>
                           </button>
                        </div>
                     </TableCell>

                     <TableCell className="text-center md:font-medium font-semibold">
                        R${(item.preco * item.quantidade).toFixed(2)}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
