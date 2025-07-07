export function Footer() {
   return (
      <footer className="flex md:w-full bg-zinc-100 justify-center flex-col items-center w-full mt-16">
         <div className="flex flex-col mt-16 justify-between md:w-7xl md:flex-row md:gap-0 gap-6 text-center md:text-start">
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-3 text-xl">Caminho Boho</h1>
               <p className="text-zinc-700 md:mx-0 mx-2">
                  Tradição e elegância em cada peça. Autenticidade que você pode
                  confiar.
               </p>
            </div>
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-3 text-xl ">Atendimento</h1>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Central de Ajuda
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Política de Troca
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Envios e Entregas
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Contato
               </a>
            </div>
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-3 text-xl">Categorias</h1>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Lehenga Choa
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Sarees
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Anarkaa Suits
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Acessórios
               </a>
            </div>
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-3 text-xl">Redes Sociais</h1>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Instagram
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  Facebook
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium"
               >
                  WhatsApp
               </a>
            </div>
         </div>
         <span className="h-[1px] bg-zinc-300 mt-16 flex justify-center w-[88vw]"></span>
         <p className="mt-6 mb-6 md:text-[16px] text-xs">
            © 2025 Caminho Boho. Todos os direitos reservados.
         </p>
      </footer>
   );
}
