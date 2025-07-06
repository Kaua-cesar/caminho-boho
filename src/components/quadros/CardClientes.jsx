import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import { MdOutlineBookmarks } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function CardClientes() {
   return (
      <>
         <div className="flex gap-10 max-w-7xl">
            <div className="flex justify-center items-start flex-col bg-white border-1 border-zinc-200 hover:scale-103 duration-300 hover:shadow-sm shadow-black/10  p-6 rounded-md gap-3">
               <div className="flex justify-center items-center gap-3 mb-3">
                  <Avatar className="scale-130">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-amber-800">
                     <h1 className="font-semibold">Maria Silva</h1>
                     <p className="text-sm text-amber-600 font-medium">
                        Rio de Janeiro, RJ
                     </p>
                  </div>
               </div>

               <p className="italic text-amber-900 font-medium">
                  "Comprei um Lehenga para o casamento da minha filha e foi
                  perfeito! A qualidade é excepcional e o atendimento foi
                  impecável."
               </p>
               <Stack spacing={1}>
                  <Rating
                     className="asd"
                     name="half-rating-read"
                     size="medium"
                     defaultValue={4.5}
                     precision={0.5}
                     readOnly
                  />
               </Stack>
            </div>
            <div className="flex justify-center items-start flex-col bg-white border-1 border-zinc-200 hover:scale-103 duration-300 hover:shadow-sm shadow-black/10  p-6 rounded-md gap-3">
               <div className="flex justify-center items-center gap-3 mb-3">
                  <Avatar className="scale-130">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-amber-800">
                     <h1 className="font-semibold">Maria Silva</h1>
                     <p className="text-sm text-amber-600 font-medium">
                        Rio de Janeiro, RJ
                     </p>
                  </div>
               </div>

               <p className="italic text-amber-900 font-medium">
                  "Comprei um Lehenga para o casamento da minha filha e foi
                  perfeito! A qualidade é excepcional e o atendimento foi
                  impecável."
               </p>
               <Stack spacing={1}>
                  <Rating
                     className="asd"
                     name="half-rating-read"
                     size="medium"
                     defaultValue={4.5}
                     precision={0.5}
                     readOnly
                  />
               </Stack>
            </div>
            <div className="flex justify-center items-start flex-col bg-white border-1 border-zinc-200 hover:scale-103 duration-300 hover:shadow-sm shadow-black/10  p-6 rounded-md gap-3">
               <div className="flex justify-center items-center gap-3 mb-3">
                  <Avatar className="scale-130">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-amber-800">
                     <h1 className="font-semibold">Maria Silva</h1>
                     <p className="text-sm text-amber-600 font-medium">
                        Rio de Janeiro, RJ
                     </p>
                  </div>
               </div>

               <p className="italic text-amber-900 font-medium">
                  "Comprei um Lehenga para o casamento da minha filha e foi
                  perfeito! A qualidade é excepcional e o atendimento foi
                  impecável."
               </p>
               <Stack spacing={1}>
                  <Rating
                     className="asd"
                     name="half-rating-read"
                     size="medium"
                     defaultValue={4.5}
                     precision={0.5}
                     readOnly
                  />
               </Stack>
            </div>
            <div className="flex justify-center items-start flex-col bg-white border-1 border-zinc-200 hover:scale-103 duration-300 hover:shadow-sm shadow-black/10  p-6 rounded-md gap-3">
               <div className="flex justify-center items-center gap-3 mb-3">
                  <Avatar className="scale-130">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-amber-800">
                     <h1 className="font-semibold">Maria Silva</h1>
                     <p className="text-sm text-amber-600 font-medium">
                        Rio de Janeiro, RJ
                     </p>
                  </div>
               </div>

               <p className="italic text-amber-900 font-medium">
                  "Comprei um Lehenga para o casamento da minha filha e foi
                  perfeito! A qualidade é excepcional e o atendimento foi
                  impecável."
               </p>
               <Stack spacing={1}>
                  <Rating
                     className="asd"
                     name="half-rating-read"
                     size="medium"
                     defaultValue={4.5}
                     precision={0.5}
                     readOnly
                  />
               </Stack>
            </div>
         </div>
      </>
   );
}
