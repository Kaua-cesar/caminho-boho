import React, { useState, useMemo } from "react";
import { Card } from "../../Card";
import { produtos } from "../Cards/CardDados";
import { CardsHome } from "../CardsHome";
import { Footer } from "./Footer";
import { Filters } from "../Filters";

function calcularPrecoComDesconto(produto) {
   return produto.precoOriginal * (1 + produto.desconto / 100);
}

export function Home() {
   const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
   const [precoSelecionado, setPrecoSelecionado] = useState("todos");
   const [ordenacao, setOrdenacao] = useState("sem-ordenacao");
   const [busca, setBusca] = useState("");
   const [quantidadeExibida, setQuantidadeExibida] = useState(8);

   const produtosFiltrados = useMemo(() => {
      return produtos
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
   }, [produtos, categoriaSelecionada, precoSelecionado, ordenacao, busca]);

   // Mostra apenas os primeiros N produtos
   const produtosParaExibir = produtosFiltrados.slice(0, quantidadeExibida);

   function handleVerMais() {
      setQuantidadeExibida((prev) => prev + 4);
   }

   return (
      <main className="flex flex-col items-center justify-center mt-16">
         <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10">
            Nossa Coleção Exclusiva
         </h1>
         <p className="mt-2 md:text-lg text-md text-center mx-10">
            Descubra peças autênticas feitas à mão com tecidos premium e
            bordados tradicionais
         </p>
         <Filters
            categoriaSelecionada={categoriaSelecionada}
            setCategoriaSelecionada={setCategoriaSelecionada}
            precoSelecionado={precoSelecionado}
            setPrecoSelecionado={setPrecoSelecionado}
            ordenacao={ordenacao}
            setOrdenacao={setOrdenacao}
            busca={busca}
            setBusca={setBusca}
         />
         {/* Produtos */}
         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 justify-center px-4 max-w-7xl mx-2 gap-4">
            {produtosParaExibir.length > 0 ? (
               produtosParaExibir.map((produto) => (
                  <Card
                     key={produto.id}
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
         {/* Botão Ver Mais */}
         {quantidadeExibida < produtosFiltrados.length && (
            <button
               onClick={handleVerMais}
               className="mt-8 mb-4 px-6 py-2 rounded cursor-pointer bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
            >
               Veja mais
            </button>
         )}
         <CardsHome />
         <Footer />
      </main>
   );
}
