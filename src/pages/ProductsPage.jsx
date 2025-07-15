// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { produtos } from "../components/cards/CardDados"; // Importa seus dados de produtos reais
import { Card } from "..//Card"; // Importa seu componente Card

export function ProductsPage() {
   const [allProducts, setAllProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);
      // Não precisamos de filtro aqui, apenas carregamos todos os produtos
      setAllProducts(produtos);
      setLoading(false);
   }, []); // O array de dependências está vazio, então roda apenas uma vez ao montar

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
      <div className="container mx-auto p-4 mt-20">
         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
