import { categorias } from "./ColletionDados";

export function CardCollection() {
   return (
      <div className="flex gap-6 justify-between  max-w-7xl">
         {categorias.map((cat, idx) => (
            <div
               key={idx}
               className="w-88 pb-3 bg-white flex flex-col justify-center  items-center rounded-sm shadow-md transition-all duration-300 ease-in-out hover:scale-105"
            >
               <img
                  src={cat.img}
                  alt={cat.nome}
                  className="w-full h-80 object-cover rounded-t-sm mb-6"
               />
               <h3 className="text-2xl font-bold text-amber-500 mb-2 mx-2 text-start">
                  {cat.nome}
               </h3>
               <p className="text-black text-md mx-2 h-6 text-start">
                  {cat.descricao}
               </p>
               <button className="border-1 font-medium p-2 w-70 rounded-sm border-amber-500 text-black mt-8 cursor-pointer">
                  Ver Colecao
               </button>
            </div>
         ))}
      </div>
   );
}
