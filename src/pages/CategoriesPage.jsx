// src/pages/CategoriesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { produtos } from "../components/Cards/CardDados"; // Importa seus dados de produtos reais

export function CategoriesPage() {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setLoading(true);
      // Extrai categorias únicas dos seus produtos
      const uniqueCategories = [...new Set(produtos.map((p) => p.categoria))];

      // Se você quiser um nome mais "amigável" para exibir (ex: "costanua" -> "Costa Nua")
      // Isso pode ser feito com um mapeamento, por exemplo:
      const formattedCategories = uniqueCategories.map((cat) => ({
         name: cat, // Nome original da categoria no dado
         displayName: cat
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()), // Formata para "Nome Bonito"
         // Ex: "costanua" -> "Costanua" (se quiser primeira letra maiúscula)
         // Ou "bohochic" -> "Boho Chic" (se quiser separar camelCase e capitalizar)
         // Para 'costanua', talvez você queira mapear manualmente para 'Vestidos Costa Nua'
         // Exemplo de mapeamento manual:
         // "costanua": "Vestidos Costa Nua",
         // "vestlenco": "Vestidos Lenço",
         // "boholongo": "Vestidos Boho Longo",
         // "bohochic": "Vestidos Boho Chic",
      }));

      // Exemplo de como você poderia usar um mapeamento mais específico se necessário:
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
      setLoading(false);
   }, []);

   if (loading) {
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
            Explore Nossas Categorias
         </h1>

         {categories.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg shadow-sm bg-gray-50 max-w-lg mx-auto">
               <p className="text-xl text-gray-700 mb-4">
                  Nenhuma categoria encontrada.
               </p>
               <p className="text-md text-gray-600">
                  Verifique seus dados de produtos.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {categories.map((category, index) => (
                  <Link
                     key={index}
                     to={`/produtos/categoria/${category.name}`} // Link para uma página de produtos por categoria
                     className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center cursor-pointer"
                  >
                     <h2 className="text-xl font-semibold text-amber-600 mb-2">
                        {category.displayName}
                     </h2>
                     <p className="text-gray-600">
                        Ver {category.displayName.toLowerCase()}
                     </p>
                  </Link>
               ))}
            </div>
         )}
      </div>
   );
}
