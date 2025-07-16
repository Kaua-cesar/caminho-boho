// src/pages/ProductsByCategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para pegar o parâmetro da URL
import { produtos } from "../components/Cards/CardDados"; // Importa seus dados de produtos reais
import { Card } from "../Card"; // Importa seu componente Card

export function ProductsByCategoryPage() {
   const { categoryName } = useParams(); // Pega o 'categoryName' da URL
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);
      // Filtra os produtos com base no categoryName da URL
      const productsInThisCategory = produtos.filter(
         (product) => product.categoria === categoryName
      );
      setFilteredProducts(productsInThisCategory);
      setLoading(false);
   }, [categoryName]); // Re-executa sempre que a categoria na URL muda

   // Função para formatar o nome da categoria para exibição
   const formatCategoryName = (name) => {
      // Mapeamento específico para seus nomes de categoria, se necessário
      const displayNames = {
         costanua: "Vestidos Costa Nua",
         vestlenco: "Vestidos Lenço",
         boholongo: "Vestidos Boho Longo",
         bohochic: "Vestidos Boho Chic",
         // Adicione mais mapeamentos aqui conforme suas categorias
      };
      // Se houver um nome mapeado, use-o; caso contrário, tente formatar automaticamente
      return (
         displayNames[name] ||
         name
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
      );
   };

   if (loading) {
      return (
         <div className="container mx-auto p-4 text-center mt-20">
            <p className="text-lg text-gray-600">
               Carregando produtos da categoria...
            </p>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4 mt-20">
         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Produtos em {formatCategoryName(categoryName)}
         </h1>

         {filteredProducts.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg shadow-sm bg-gray-50 max-w-lg mx-auto">
               <p className="text-xl text-gray-700 mb-4">
                  Nenhum produto encontrado nesta categoria.
               </p>
               <p className="text-md text-gray-600">
                  Por favor, verifique a categoria ou os dados do produto.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {filteredProducts.map((product) => (
                  <Card
                     key={product.id}
                     id={product.id}
                     nome={product.nome}
                     preco={product.precoOriginal} // Assumindo que Card usa 'preco' para o preço principal
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
