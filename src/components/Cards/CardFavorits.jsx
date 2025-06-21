import { IoHeartOutline } from "react-icons/io5";
export function CardFavorits({ desconto }) {
   return (
      <>
         {desconto && (
            <span className="bg-red-500 text-white px-4 py-1 absolute left-0 top-0 z-10 rounded-xl text-xs m-3 font-semibold">
               {desconto}%
            </span>
         )}
         <span className="bg-zinc-300 text-black/50 p-2 absolute right-0 top-0 z-10 rounded-sm text-xl m-3 font-semibold cursor-pointer">
            <IoHeartOutline />
         </span>
      </>
   );
}
