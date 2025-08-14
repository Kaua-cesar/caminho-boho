import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApp } from "firebase/app";

export function CategoriesPage() {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function fetchCategories() {
         setLoading(true);
         try {
            const app = getApp();
            const db = getFirestore(app);
            const snapshot = await getDocs(collection(db, "produtos"));
            const produtos = snapshot.docs.map((doc) => doc.data());

            const uniqueCategories = [
               ...new Set(produtos.map((p) => p.categoria)),
            ];

            const categoryDisplayNames = {
               costanua: "Vestidos Costa Nua",
               vestlenco: "Vestidos Lenço",
               boholongo: "Vestidos Boho Longo",
               bohochic: "Vestidos Boho Chic",
               // Adicione mais mapeamentos conforme suas categorias
            };

            const finalCategories = uniqueCategories.map((cat) => ({
               name: cat,
               displayName:
                  categoryDisplayNames[cat] ||
                  cat
                     .replace(/([A-Z])/g, " $1")
                     .replace(/^./, (str) => str.toUpperCase()),
            }));

            setCategories(finalCategories);
         } catch (err) {
            console.error("Erro ao buscar categorias:", err);
         } finally {
            setLoading(false);
         }
      }

      fetchCategories();
   }, []);

   if (loading) {
      return (
         <div className="container mx-auto p-4 text-center mt-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <p className="text-lg text-gray-600 animate-pulse">
               Carregando suas categorias...
            </p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
         <h1 className="text-3xl sm:text-4xl font-bold my-8 text-center text-gray-800">
            Explore Nossas Categorias
         </h1>

         {categories.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg shadow-sm bg-gray-50 w-full max-w-lg">
               <p className="text-xl text-gray-700 mb-4">
                  Nenhuma categoria encontrada.
               </p>
               <p className="text-md text-gray-600">
                  Verifique seus produtos no Firestore ou adicione novos
                  produtos.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
               {categories.map((category, index) => (
                  <Link
                     key={index}
                     to={`/produtos/categoria/${category.name}`}
                     className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center cursor-pointer flex flex-col justify-between h-full"
                  >
                     <h2 className="text-xl sm:text-2xl font-semibold text-amber-600 mb-2">
                        {category.displayName}
                     </h2>
                     <p className="text-gray-600 text-sm sm:text-base">
                        Ver {category.displayName.toLowerCase()}
                     </p>
                  </Link>
               ))}
            </div>
         )}
      </div>
   );
}
