import React, { useState } from "react";
import { Input } from "./ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "./ui/select";
import { FaSearch } from "react-icons/fa";
import { Card } from "../Card";
import { produtos } from "./Cards/CardDados";
import { CardQuadros } from "./quadros/CardQuadros";
import { CardCollection } from "./Collection/CardCollection";
import { CardClientes } from "./quadros/CardClientes";

// Função para calcular preço com desconto
function calcularPrecoComDesconto(produto) {
   return produto.precoOriginal * (1 + produto.desconto / 100);
}

export function Home() {
   const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
   const [precoSelecionado, setPrecoSelecionado] = useState("todos");
   const [ordenacao, setOrdenacao] = useState("sem-ordenacao");
   const [busca, setBusca] = useState("");

   const produtosFiltrados = produtos
      .filter((produto) =>
         categoriaSelecionada !== "todas"
            ? produto.categoria === categoriaSelecionada
            : true
      )
      .filter((produto) => {
         const preco = calcularPrecoComDesconto(produto);
         if (precoSelecionado === "cem") return preco <= 100;
         if (precoSelecionado === "duzentos") return preco <= 200;
         if (precoSelecionado === "trezentos") return preco <= 300;
         if (precoSelecionado === "quinhentos") return preco <= 500;
         return true;
      })
      .filter((produto) =>
         produto.nome.toLowerCase().includes(busca.toLowerCase())
      )
      .sort((a, b) => {
         const precoA = calcularPrecoComDesconto(a);
         const precoB = calcularPrecoComDesconto(b);
         if (ordenacao === "costamenornua") return precoA - precoB;
         if (ordenacao === "costamaiorpreco") return precoB - precoA;
         if (ordenacao === "costavaliados") return b.avaliacao - a.avaliacao;
         return 0;
      });

   return (
      <div className="flex flex-col items-center justify-center mt-16">
         <h1 className="text-4xl font-bold text-amber-500">
            Nossa Coleção Exclusiva
         </h1>
         <p className="mt-2 text-lg text-center">
            Descubra peças autênticas feitas à mão com tecidos premium <br /> e
            bordados tradicionais
         </p>

         {/* Filtros */}
         <div className="flex items-center my-9 gap-4 flex-wrap justify-between w-full max-w-7xl px-4">
            <div className="flex items-center gap-6 flex-wrap">
               <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                     placeholder="Buscar produtos"
                     className="w-52 pl-10"
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

         {/* Produtos */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center px-4 max-w-7xl">
            {produtosFiltrados.length > 0 ? (
               produtosFiltrados.map((produto, index) => (
                  <Card
                     key={index}
                     {...produto}
                     preco={calcularPrecoComDesconto(produto).toFixed(2)}
                  />
               ))
            ) : (
               <p className="text-gray-500 text-center m-8">
                  Nenhum produto encontrado.
               </p>
            )}
         </div>
         <div className="mt-16 mb-8">
            <h1 className="text-4xl font-bold text-amber-500  text-center">
               Explore Nossas Categorias
            </h1>
            <p className="mt-2 text-lg text-center">
               Cada peça é cuidadosamente selecionada para oferecer
               autenticidade
               <br /> e qualidade excepcional
            </p>
         </div>
         <CardCollection />
         <div className="mt-16 mb-8 ">
            <h1 className="text-4xl font-bold text-amber-500  text-center">
               Por que Escolher a Gente?
            </h1>
            <p className="mt-2 text-lg text-center">
               Somos especializados em moda indiana autêntica com o melhor
               <br />
               atendimento do Brasil
            </p>
         </div>
         <CardQuadros />
         <div className=" w-full bg-zinc-100 mt-16 flex flex-col justify-center items-center pb-16">
            <h1 className="text-4xl font-bold text-amber-500 mt-16 text-center">
               O que Nossas Clientes Dizem
            </h1>
            <p className="mt-2 text-lg text-center mb-8">
               Mais de 1000 mulheres já se apaixonaram por nossos <br />
               vestidos. Veja alguns depoimentos
            </p>
            <CardClientes />
         </div>
      </div>
   );
}
