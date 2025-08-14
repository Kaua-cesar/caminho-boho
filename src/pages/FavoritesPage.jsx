import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { Card } from "../Card";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";

function calcularPrecoComDesconto(produto) {
   const precoComDesconto =
      produto.precoOriginal - (produto.precoOriginal * produto.desconto) / 100;
   return precoComDesconto;
}

export function FavoritesPage() {
   const { favorites, totalFavorites, favoritesLoading } = useFavorites();
   const [favoriteProductsData, setFavoriteProductsData] = useState([]);

   useEffect(() => {
      async function fetchFavorites() {
         try {
            const app = getApp();
            const db = getFirestore(app);
            const snapshot = await getDocs(collection(db, "produtos"));
            const produtos = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));

            const fetchedData = produtos.filter((product) =>
               favorites.includes(product.id)
            );
            setFavoriteProductsData(fetchedData);
         } catch (err) {
            console.error("Erro ao buscar produtos favoritos:", err);
         }
      }

      if (favorites.length > 0) fetchFavorites();
      else setFavoriteProductsData([]);
   }, [favorites]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {favoriteProductsData.map((product) => (
                  <Card
                     key={product.id}
                     id={product.id}
                     nome={product.nome}
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
      </div>
   );
}
