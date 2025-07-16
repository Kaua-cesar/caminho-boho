import React, { useState, useEffect } from "react";
import { produtos } from "../components/Cards/CardDados"; // Importa seus dados de produtos reais
import { Card } from "..//Card"; // Importa seu componente Card

export function ProductsPage() {
   const [allProducts, setAllProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);
      setAllProducts(produtos);
      setLoading(false);
   }, []);

   if (loading) {
      return (
         <div className="container mx-auto p-4 text-center mt-20">
            <p className="text-lg text-gray-600">
               Carregando todos os produtos...
            </p>
         </div>
      );
   }

   return (
      // Ajustes no container principal:
      // - Removi 'container' e 'mx-auto' aqui para usar um padding mais flexível
      // - Usei 'p-4' para padding geral em todas as telas
      // - Adicionei 'md:p-8' para aumentar o padding em telas maiores
      // - 'max-w-screen-xl' para um limite de largura generoso, mas não tão restritivo quanto '7xl'
      // - Centralizado com 'mx-auto' dentro do layout geral
      <div className="min-h-screen p-4 md:p-8 mx-auto max-w-screen-xl ">
         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 md:text-4xl">
            Todos os Nossos Produtos
         </h1>

         {allProducts.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg shadow-sm bg-gray-50 max-w-lg mx-auto">
               <p className="text-xl text-gray-700 mb-4">
                  Nenhum produto cadastrado ainda.
               </p>
               <p className="text-md text-gray-600">
                  Volte mais tarde para conferir nossas novidades!
               </p>
            </div>
         ) : (
            // Ajustes no grid:
            // - 'gap-4' para um espaçamento padrão entre os cards
            // - 'sm:gap-6' para um pouco mais de espaçamento em telas maiores
            // - Mantive 'place-items-center' para centralizar os cards
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 place-items-center">
               {allProducts.map((product) => (
                  <Card
                     key={product.id}
                     id={product.id}
                     nome={product.nome}
                     preco={product.precoOriginal}
                     precoOriginal={product.precoOriginal}
                     estoque={product.estoque}
                     cores={product.cores}
                     tamanhos={product.tamanhos}
                     imagem={product.imagem}
                     desconto={product.desconto}
                     qntavaliacoes={product.qntavaliacoes}
                     avaliacao={product.avaliacao}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
