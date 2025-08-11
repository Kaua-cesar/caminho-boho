// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { Card } from "../Card";
// Descomente se usa Shadcn UI Button
// import { Button } from "@/components/ui/button";

// IMPORTANTE: Importe seus dados reais de produtos aqui!
import { produtos } from "../components/Cards/CardDados";

/**
 * Função para calcular o preço final com desconto.
 * @param {object} produto - O objeto do produto contendo precoOriginal e desconto.
 * @returns {number} O preço final calculado.
 */
function calcularPrecoComDesconto(produto) {
   // A lógica foi ajustada para subtrair o desconto, não somar.
   // Isso garante que o preço final seja menor que o original.
   const precoComDesconto =
      produto.precoOriginal + (produto.precoOriginal * produto.desconto) / 100;
   return precoComDesconto;
}

export function FavoritesPage() {
   // Pega os dados e o estado de carregamento do contexto de favoritos
   const { favorites, totalFavorites, favoritesLoading } = useFavorites();
   const [favoriteProductsData, setFavoriteProductsData] = useState([]);

   // Usa useEffect para filtrar os produtos favoritos sempre que a lista de favoritos muda
   useEffect(() => {
      // Filtra a lista completa de produtos para encontrar apenas os que estão nos favoritos
      const fetchedData = produtos.filter((product) =>
         favorites.includes(product.id)
      );
      setFavoriteProductsData(fetchedData);
   }, [favorites]); // Este efeito roda sempre que a lista de favoritos do contexto muda

   // Mostra um estado de carregamento enquanto os favoritos são buscados
   if (favoritesLoading) {
      return (
         <div className="container mx-auto p-4 text-center mt-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <p className="text-lg text-gray-600 animate-pulse">
               Carregando seus produtos favoritos...
            </p>
         </div>
      );
   }

   return (
      <div className="flex items-center justify-center flex-col pt-[4.25rem]">
         <h1 className="text-3xl font-bold my-8 text-center text-gray-800">
            Meus Favoritos ({totalFavorites})
         </h1>

         {/* Mostra uma mensagem se não houver favoritos */}
         {totalFavorites === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg shadow-sm bg-gray-50 max-w-lg mx-auto">
               <p className="text-xl text-gray-700 mb-4">
                  💖 Sua lista de favoritos está vazia!
               </p>
               <p className="text-md text-gray-600 mb-6">
                  Explore nossos produtos e clique no coração para adicionar os
                  que mais gostar aqui.
               </p>
            </div>
         ) : (
            // Renderiza os cards dos produtos favoritos
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {favoriteProductsData.map((product) => (
                  <Card
                     key={product.id}
                     id={product.id}
                     nome={product.nome}
                     // Passando o preço calculado e formatado com duas casas decimais,
                     // exatamente como no seu componente Home
                     preco={calcularPrecoComDesconto(product).toFixed(2)}
                     precoOriginal={product.precoOriginal.toFixed(2)}
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

         <div className="text-center mt-8"></div>
      </div>
   );
}
