import React from "react";
import { Input } from "./ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "./ui/select";
import { FaSearch } from "react-icons/fa";

export function Filters({
   categoriaSelecionada,
   setCategoriaSelecionada,
   precoSelecionado,
   setPrecoSelecionado,
   ordenacao,
   setOrdenacao,
   busca,
   setBusca,
}) {
   return (
      <div className="flex items-center my-9 gap-4 flex-wrap justify-between w-full max-w-7xl px-4">
         <div className="flex items-center gap-6 flex-wrap">
            <div className="relative w-full sm:w-auto">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <Input
                  placeholder="Buscar produtos"
                  className="md:w-52 pl-10 w-full"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
               />
            </div>

            <Select
               onValueChange={setCategoriaSelecionada}
               value={categoriaSelecionada}
            >
               <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  <SelectItem value="costanua">Costa Nua</SelectItem>
                  <SelectItem value="vestlenco">Vest Lenço</SelectItem>
                  <SelectItem value="boholongo">Boho Longo</SelectItem>
                  <SelectItem value="bohochic">Boho Chic</SelectItem>
               </SelectContent>
            </Select>

            <Select
               onValueChange={setPrecoSelecionado}
               value={precoSelecionado}
            >
               <SelectTrigger>
                  <SelectValue placeholder="Todos os preços" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="todos">Todos os preços</SelectItem>
                  <SelectItem value="cem">Até R$100</SelectItem>
                  <SelectItem value="duzentos">Até R$200</SelectItem>
                  <SelectItem value="trezentos">Até R$300</SelectItem>
                  <SelectItem value="quinhentos">Até R$500</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <Select onValueChange={setOrdenacao} value={ordenacao}>
            <SelectTrigger>
               <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="sem-ordenacao">Sem ordenação</SelectItem>
               <SelectItem value="costamenornua">Menor Preço</SelectItem>
               <SelectItem value="costamaiorpreco">Maior Preço</SelectItem>
               <SelectItem value="costavaliados">Mais avaliados</SelectItem>
            </SelectContent>
         </Select>
      </div>
   );
}
