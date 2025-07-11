export default function FreteCEP({ cep, handleChange }) {
   return (
      <div className="flex items-center gap-2 md:flex-wrap mb-14 md:mb-0">
         <p className="mr-3 w-48">Informe seu CEP</p>
         <input
            type="text"
            value={cep}
            onChange={handleChange}
            maxLength={9}
            placeholder="00000-000"
            className="p-2 rounded-sm border w-28"
            inputMode="numeric"
         />
         <div className="flex-grow flex justify-between items-center gap-4">
            <div className="relative inline-block">
               <button className="cursor-pointer bg-amber-600 text-white p-2 rounded-md hover:bg-amber-700 w-28">
                  Calcular
               </button>
               <span className="md:no-underline underline absolute left-1/2 -translate-x-1/2 mt-1 text-sm text-gray-600 top-full w-32 text-center hover:underline">
                  <a
                     href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Não sei meu CEP
                  </a>
               </span>
            </div>
         </div>
      </div>
   );
}
