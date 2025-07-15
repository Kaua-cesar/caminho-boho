// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { Card } from "../Card";
import { Button } from "@/components/ui/button"; // Descomente se usa Shadcn UI Button

// ✨ IMPORTANTE: Importe seus dados reais de produtos aqui!
import { produtos } from "../components/Cards/CardDados"; // ✨ CORRIGIDO: O caminho e o nome da constante de importação

export function FavoritesPage() {
   const { favorites, clearFavorites, totalFavorites } = useFavorites();
   const [favoriteProductsData, setFavoriteProductsData] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);
      // ✨ AGORA FILTRE A PARTIR DA SUA LISTA DE DADOS REAIS:
      const fetchedData = produtos.filter((product) =>
         favorites.includes(product.id)
      );
      setFavoriteProductsData(fetchedData);
      setLoading(false);
   }, [favorites]); // Este efeito roda sempre que a lista de favoritos muda

   if (loading) {
      return (
         <div className="container mx-auto p-4 text-center mt-20">
            <p className="text-lg text-gray-600">
               Carregando seus produtos favoritos...
            </p>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4 mt-20">
         <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
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
                        desconto={product.desconto} // Se o desconto for negativo, você pode querer ajustá-lo para ser um valor positivo no Card
                        qntavaliacoes={product.qntavaliacoes}
                        avaliacao={product.avaliacao}
                     />
                  ))}
               </div>
               <div className="text-center mt-8">
                  <Button
                     variant="destructive"
                     onClick={clearFavorites}
                     className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base rounded-md shadow-lg transition-colors duration-200"
                  >
                     Limpar Todos os Favoritos
                  </Button>
               </div>
            </>
         )}
      </div>
   );
}
