export function Footer() {
   return (
      <footer className="flex md:w-full bg-zinc-100 justify-center flex-col items-center w-full mt-16">
         <div className="flex flex-col mt-10 justify-between md:w-7xl md:flex-row md:gap-0 gap-6 text-center md:text-start">
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-1 text-xl">Caminho Boho</h1>
               <p className="text-zinc-700 md:mx-0 mx-2 text-sm">
                  Tradição e elegância em cada peça. Autenticidade que você pode
                  confiar.
               </p>
            </div>
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-1 text-xl ">Atendimento</h1>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Central de Ajuda
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Política de Troca
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Envios e Entregas
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Contato
               </a>
            </div>
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-1 text-xl">Categorias</h1>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Lehenga Choa
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Sarees
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Anarkaa Suits
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Acessórios
               </a>
            </div>
            <div className="flex flex-col gap-2 ">
               <h1 className="font-semibold mb-1 text-xl">Redes Sociais</h1>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Instagram
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  Facebook
               </a>
               <a
                  href="#"
                  className="text-zinc-700 hover:text-black hover:font-medium text-sm"
               >
                  WhatsApp
               </a>
            </div>
         </div>
         <span className="h-[1px] bg-zinc-300 mt-7 flex justify-center w-[88vw]"></span>
         <p className="my-4 md:text-sm text-xs">
            © 2025 Caminho Boho. Todos os direitos reservados.
         </p>
      </footer>
   );
}
