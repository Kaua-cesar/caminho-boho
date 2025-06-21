import { IoHeartOutline } from "react-icons/io5";
import { RiShoppingCartFill } from "react-icons/ri";
import Logo from "./assets/logo.png";

export function Nav() {
   return (
      <div className="text-amber-600  font-semibold flex justify-around px-50 w-screen h-17 bg-white shadow-xs shadow-amber-600/50">
         <div className="flex scale-80">
            <img src={Logo} alt="" />
         </div>
         <ul className="flex gap-8 items-center ">
            <li className="cursor-pointer hover:text-amber-500">Inicio</li>
            <li className="cursor-pointer hover:text-amber-500">Produtos</li>
            <li className="cursor-pointer hover:text-amber-500">Categorias</li>
            <li className="cursor-pointer hover:text-amber-500">Sobre</li>
            <li className="cursor-pointer hover:text-amber-500">Contato</li>
         </ul>
         <div className="flex items-center gap-10 text-2xl">
            <IoHeartOutline className="cursor-pointer" />
            <RiShoppingCartFill className="cursor-pointer" />
         </div>
      </div>
   );
}
