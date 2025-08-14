import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../Card";
import {
   getFirestore,
   collection,
   getDocs,
   query,
   where,
} from "firebase/firestore";
import { getApp } from "firebase/app";

export function ProductsByCategoryPage() {
   const { categoryName } = useParams();
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function fetchProducts() {
         try {
            setLoading(true);
            const app = getApp();
            const db = getFirestore(app);

            // Consulta filtrando apenas os produtos da categoria
            const produtosRef = collection(db, "produtos");
            const q = query(
               produtosRef,
               where("categoria", "==", categoryName)
            );
            const snapshot = await getDocs(q);

            const productsInThisCategory = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));

            setFilteredProducts(productsInThisCategory);
         } catch (err) {
            console.error("Erro ao buscar produtos por categoria:", err);
            setFilteredProducts([]);
         } finally {
            setLoading(false);
         }
      }

      fetchProducts();
   }, [categoryName]);

   const formatCategoryName = (name) => {
      const displayNames = {
         costanua: "Vestidos Costa Nua",
         vestlenco: "Vestidos Lenço",
         boholongo: "Vestidos Boho Longo",
         bohochic: "Vestidos Boho Chic",
      };
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
