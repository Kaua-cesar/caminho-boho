// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext"; // Ajuste o caminho se necessário
import { Card } from "../Card"; // Certifique-se de que o caminho para o seu componente Card está correto
import { Button } from "@/components/ui/button"; // Descomente se usa Shadcn UI Button

// IMPORTANTE: Importe seus dados reais de produtos aqui!
import { produtos } from "../components/Cards/CardDados"; // O caminho e o nome da constante de importação

export function FavoritesPage() {
   // Agora pegamos 'favoritesLoading' diretamente do contexto
   const { favorites, totalFavorites, favoritesLoading } = useFavorites();
   const [favoriteProductsData, setFavoriteProductsData] = useState([]);

   // O useEffect agora só filtra os dados quando 'favorites' (a lista do Firestore) muda ou é carregada
   useEffect(() => {
      // Não é mais necessário um estado 'loading' local aqui,
      // pois 'favoritesLoading' do contexto já gerencia isso.
      // Contudo, a lógica de filtragem continua a mesma.
      const fetchedData = produtos.filter((product) =>
         favorites.includes(product.id)
      );
      setFavoriteProductsData(fetchedData);
   }, [favorites]); // Este efeito roda sempre que a lista de favoritos do contexto muda

   // Usamos 'favoritesLoading' diretamente do contexto para exibir o estado de carregamento
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
      <div className="flex items-center justify-center flex-col ">
         <h1 className="text-3xl font-bold my-8 text-center text-gray-800">
            Meus Favoritos ({totalFavorites})
         </h1>
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
            <>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {favoriteProductsData.map((product) => (
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
               <div className="text-center mt-8"></div>
            </>
         )}
      </div>
   );
}
