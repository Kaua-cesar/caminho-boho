import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

import { FaEye } from "react-icons/fa";

export function CustomDialog() {
   return (
      <>
         <Dialog>
            <DialogTrigger className="z-50 bg-white text-black cursor-pointer p-3 rounded-md flex items-center gap-2 text-sm font-medium">
               <FaEye />
               Veja Detalhes
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                     This action cannot be undone. This will permanently delete
                     your account and remove your data from our servers.
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </>
   );
}
