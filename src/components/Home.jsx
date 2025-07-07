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
import { Separator } from "@/components/ui/separator";

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
         <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10 md-mx-0">
            Nossa Coleção Exclusiva
         </h1>
         <p className="mt-2 md:text-lg text-md text-center mx-10 md-mx-0">
            Descubra peças autênticas feitas à mão com tecidos premium e
            bordados tradicionais
         </p>
         {/* Filtros */}
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
         <div className="mt-16 mb-8 ">
            <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center">
               Explore Nossas Categorias
            </h1>
            <p className="mt-2 md:text-lg text-md text-center">
               Cada peça é cuidadosamente selecionada para oferecer
               autenticidade
               <br /> e qualidade excepcional
            </p>
         </div>
         <CardCollection />
         <div className="bg-zinc-100 w-full flex flex-col  items-center pb-16 mt-16">
            <div className="mt-16 mb-8 ">
               <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10 md-mx-0">
                  Por que Escolher a Gente?
               </h1>
               <p className="mt-2 md:text-lg text-md text-center mx-10 md-mx-0">
                  Somos especializados em moda indiana autêntica com o melhor
                  <br />
                  atendimento do Brasil
               </p>
            </div>
            <CardQuadros />
         </div>
         <div className=" w-full  mt-16 flex flex-col justify-center items-center pb-16">
            <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10 md:mx-0">
               O que Nossas Clientes Dizem
            </h1>
            <p className="mt-2 md:text-lg text-md text-center mb-8 mx-10 md-mx-0">
               Mais de 1000 mulheres já se apaixonaram por nossos <br />
               vestidos. Veja alguns depoimentos
            </p>
            <CardClientes />
         </div>
         <footer className="flex md:w-full bg-zinc-100 justify-center flex-col items-center w-full">
            <div className="flex flex-col mt-16 justify-between md:w-7xl md:flex-row md:gap-0 gap-6 text-center md:text-start">
               <div className="flex flex-col gap-2 ">
                  <h1 className="font-semibold mb-3 text-xl">Caminho Boho</h1>
                  <p className="text-zinc-700">
                     Tradição e elegância em cada peça. Autenticidade que você
                     pode confiar.
                  </p>
               </div>
               <div className="flex flex-col gap-2 ">
                  <h1 className="font-semibold mb-3 text-xl ">Atendimento</h1>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Central de Ajuda
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Política de Troca
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Envios e Entregas
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Contato
                  </a>
               </div>
               <div className="flex flex-col gap-2 ">
                  <h1 className="font-semibold mb-3 text-xl">Categorias</h1>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Lehenga Choa
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Sarees
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Anarkaa Suits
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Acessórios
                  </a>
               </div>
               <div className="flex flex-col gap-2 ">
                  <h1 className="font-semibold mb-3 text-xl">Redes Sociais</h1>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Instagram
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     Facebook
                  </a>
                  <a
                     href="#"
                     className="text-zinc-700 hover:text-black hover:font-medium"
                  >
                     WhatsApp
                  </a>
               </div>
            </div>
            <span className="h-[1px] bg-zinc-300 mt-16 flex justify-center w-[88vw]"></span>
            <p className="mt-6 mb-6 md:text-[16px] text-xs">
               © 2025 Caminho Boho. Todos os direitos reservados.
            </p>
         </footer>
      </div>
   );
}
