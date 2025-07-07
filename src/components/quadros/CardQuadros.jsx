import {
   BiSolidMedal,
   BiStar,
   BiHeart,
   BiUserVoice,
   BiShieldQuarter,
} from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";

export function CardQuadros() {
   return (
      <div className="md:grid grid grid-cols-2 md:grid-cols-3 gap-6 md:w-7xl w-90 text-center">
         <div className="flex flex-col items-center p-6 rounded-md border-1 bg-white border-amber-500/60 hover:shadow-sm shadow-black/10 hover:scale-102 transition-all duration-300">
            <span className="bg-amber-500 rounded-full p-5 text-white text-4xl mb-5">
               <BiSolidMedal />
            </span>
            <h1 className="font-bold">Qualidade Premium</h1>
            <p className="text-center text-sm md:text-[16px]">
               Tecidos selecionados e bordados artesanais únicos
            </p>
         </div>
         <div className="flex flex-col items-center p-6 rounded-md border-1 bg-white border-amber-500/60 hover:shadow-sm shadow-black/10 hover:scale-102 transition-all duration-300">
            <span className="bg-amber-500 rounded-full p-5 text-white text-4xl mb-5">
               <TbTruckDelivery />
            </span>
            <h1 className="font-bold">Entrega Rápida</h1>
            <p className="text-center text-sm md:text-[16px]">
               Entregamos em todo o Brasil com segurança e agilidade
            </p>
         </div>
         <div className="flex flex-col items-center p-6 rounded-md border-1 bg-white border-amber-500/60 hover:shadow-sm shadow-black/10 hover:scale-102 transition-all duration-300">
            <span className="bg-amber-500 rounded-full p-5 text-white text-4xl mb-5">
               <BiShieldQuarter />
            </span>
            <h1 className="font-bold">Compra Garantida</h1>
            <p className="text-center text-sm md:text-[16px]">
               30 dias para troca ou devolução sem complicações
            </p>
         </div>
         <div className="flex flex-col items-center p-6 rounded-md border-1 bg-white border-amber-500/60 hover:shadow-sm shadow-black/10 hover:scale-102 transition-all duration-300">
            <span className="bg-amber-500 rounded-full p-5 text-white text-4xl mb-5">
               <BiUserVoice />
            </span>
            <h1 className="font-bold">Atendimento Especializado</h1>
            <p className="text-center text-sm md:text-[16px]">
               Nossa equipe conhece cada peça e pode te ajudar
            </p>
         </div>
         <div className="flex flex-col items-center p-6 rounded-md border-1 bg-white border-amber-500/60 hover:shadow-sm shadow-black/10 hover:scale-102 transition-all duration-300">
            <span className="bg-amber-500 rounded-full p-5 text-white text-4xl mb-5">
               <BiHeart />
            </span>
            <h1 className="font-bold">Feito com Amor</h1>
            <p className="text-center text-sm md:text-[16px]">
               Cada vestido é uma obra de arte criada com carinho
            </p>
         </div>
         <div className="flex flex-col items-center p-6 rounded-md border-1 bg-white border-amber-500/60 hover:shadow-sm shadow-black/10 hover:scale-102 transition-all duration-300">
            <span className="bg-amber-500 rounded-full p-5 text-white text-4xl mb-5">
               <BiStar />
            </span>
            <h1 className="font-bold">Avaliação 5 Estrelas</h1>
            <p className="text-center text-sm md:text-[16px]">
               Mais de 1000 clientes satisfeitas recomendam
            </p>
         </div>
      </div>
   );
}
