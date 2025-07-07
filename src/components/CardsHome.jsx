import { CardQuadros } from "./quadros/CardQuadros";
import { CardCollection } from "./Collection/CardCollection";
import { CardClientes } from "./quadros/CardClientes";
export function CardsHome() {
   return (
      <>
         <div className="mt-16">
            <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10">
               Explore Nossas Categorias
            </h1>
            <p className="mb-9 mt-2 md:text-lg text-md text-center mx-10">
               Cada peça é cuidadosamente selecionada para oferecer
               autenticidade
               <br /> e qualidade excepcional
            </p>
         </div>
         <CardCollection />
         <div className="bg-zinc-100 w-full flex flex-col items-center pb-16 mt-16">
            <div className="mt-16 mb-8 ">
               <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10">
                  Por que Escolher a Gente?
               </h1>
               <p className="mt-2 md:text-lg text-md text-center mx-10">
                  Somos especializados em moda indiana autêntica com o melhor
                  <br />
                  atendimento do Brasil
               </p>
            </div>
            <CardQuadros />
         </div>
         <div className="w-full flex flex-col justify-center items-center ">
            <div className="mb-8  mt-16">
               <h1 className="md:text-4xl text-2xl font-bold text-amber-500 text-center mx-10">
                  O que Nossas Clientes Dizem
               </h1>
               <p className="mt-2 md:text-lg text-md text-center mx-10">
                  Mais de 1000 mulheres já se apaixonaram por nossos <br />
                  vestidos. Veja alguns depoimentos
               </p>
            </div>
            <CardClientes />
         </div>
      </>
   );
}
