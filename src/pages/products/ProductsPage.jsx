import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Card } from "../../Card";

export function ProductsPage() {
   const [allProducts, setAllProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function fetchProducts() {
         setLoading(true);
         try {
            const querySnapshot = await getDocs(collection(db, "produtos"));
            const productsData = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            setAllProducts(productsData);
         } catch (err) {
            console.error("Erro ao buscar produtos:", err);
            setAllProducts([]);
         }
         setLoading(false);
      }

      fetchProducts();
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
      <div className="min-h-screen p-4 md:p-8 mx-auto max-w-screen-xl">
         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 md:text-4xl pt-[4.25rem]">
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
