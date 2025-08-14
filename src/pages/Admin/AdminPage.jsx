import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CiFileOn, CiSearch } from "react-icons/ci";
import { IoIosGitBranch } from "react-icons/io";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import { LuFolderOpen, LuUsers } from "react-icons/lu";
import { FaRegChartBar } from "react-icons/fa";
import { SiHackthebox } from "react-icons/si";
import { FiShoppingCart, FiFileText } from "react-icons/fi";

const navItems = [
   { key: "visao-geral", name: "visao-geral.jsx", icon: FaRegChartBar },

   { key: "produtos", name: "produtos.jsx", icon: SiHackthebox },

   { key: "pedidos", name: "pedidos.jsx", icon: FiShoppingCart },

   { key: "clientes", name: "clientes.jsx", icon: LuUsers },

   { key: "relatorios", name: "relatorios.jsx", icon: FiFileText },
];

const sidebarIcons = [
   { key: "file", icon: CiFileOn, color: "text-[#bd93f9]" },

   { key: "search", icon: CiSearch, color: "text-[#bd93f9]" },

   { key: "git", icon: IoIosGitBranch, color: "text-[#bd93f9]" },
];

const SidebarIcons = ({ selectedIcon, setSelectedIcon }) => (
   <div className="flex flex-col p-2 space-y-2 text-xl bg-[#191a21] rounded-l-md border-r border-[#44475a] ">
      {sidebarIcons.map((item) => (
         <button
            key={item.key}
            aria-label={item.key}
            onClick={() => setSelectedIcon(item.key)}
            className={`p-2 rounded-lg transition-all duration-200 ${
               selectedIcon === item.key
                  ? `bg-[#44475a] ${item.color}`
                  : "text-[#6272a4] hover:bg-[#44475a]"
            }`}
         >
            <item.icon
               className={`text-lg drop-shadow-[0_0_0.5px_currentColor] ${
                  selectedIcon === item.key
                     ? "drop-shadow-[0_0_1px_currentColor]"
                     : ""
               }`}
            />
         </button>
      ))}
   </div>
);

const SidebarNav = ({ user, selectedNav, setSelectedNav }) => {
   const [isFolderOpen, setIsFolderOpen] = useState(true);

   const toggleFolder = () => {
      setIsFolderOpen(!isFolderOpen);
   };

   return (
      <div className="flex flex-col bg-[#21222c] border-r border-[#44475a] min-w-[250px]">
         <div className="flex items-center justify-between w-full p-2 border-b border-[#44475a] ">
            <p className="text-xs uppercase font-medium pl-2">EXPLORADOR</p> 
            <button
               aria-label="Adicionar item"
               className="p-2 text-xs rounded-md text-[#6272a4] hover:bg-[#44475a]"
            >
               <FaPlus /> 
            </button>
         </div>
         <div className="flex items-center gap-1.5 p-3 text-[#6272a4]">
            <span className="text-[10px]">
               <FaChevronDown /> 
            </span>
            <p className="text-xs uppercase font-medium">
               DASHBOARD CAMINHO BOHO
            </p>
         </div>
         <div
            className="flex items-center gap-1.5 pl-3 text-white cursor-pointer font-medium"
            onClick={toggleFolder}
         >
            <span
               className={`text-[10px] text-[#6272a4] transition-transform duration-200 ${
                  isFolderOpen ? "rotate-0" : "-rotate-90"
               }`}
            >
               <FaChevronDown /> 
            </span>
            <span className="text-lg text-[#ffb86c]">
               <LuFolderOpen /> 
            </span>
            <p className="text-sm">dashboard</p> 
         </div>
         {isFolderOpen && (
            <div className="w-full mt-2 text-sm space-y-1 font-medium">
               {navItems.map((item) => (
                  <button
                     key={item.key}
                     aria-label={item.name}
                     onClick={() => setSelectedNav(item.key)}
                     className={`flex items-center w-full gap-2 py-1 pl-13 pr-3 transition-colors duration-200 ${
                        selectedNav === item.key
                           ? "bg-[#44475a] text-[#bd93f9]"
                           : "text-[#f8f8f2] hover:bg-[#44475a]"
                     }`}
                  >
                     <item.icon className="text-[#8be9fd]" /> 
                     <p className="text-left">{item.name}</p> 
                  </button>
               ))}
            </div>
         )}
      </div>
   );
};

const MainContent = ({ user, selectedNav, setSelectedNav }) => {
   const selectedItem = navItems.find((item) => item.key === selectedNav);

   const renderContent = () => {
      switch (selectedNav) {
         case "visao-geral":
            return (
               <p className="mt-4 text-[#6272a4]">
                  Aqui você pode gerenciar seus produtos.asdsa
               </p>
            );

         case "produtos":
            return (
               <p className="mt-4 text-[#6272a4]">
                  Aqui você pode gerenciar seus produtos.
               </p>
            );

         case "pedidos":
            return (
               <p className="mt-4 text-[#6272a4]">
                  Visualize e processe os pedidos dos clientes.
               </p>
            );

         case "clientes":
            return (
               <p className="mt-4 text-[#6272a4]">
                  Gerencie a lista de clientes.
               </p>
            );

         case "relatorios":
            return (
               <p className="mt-4 text-[#6272a4]">
                  Acesse os relatórios e análises.
               </p>
            );

         default:
            return (
               <p className="mt-4 text-[#6272a4]">
                  Selecione um item no menu para começar.
               </p>
            );
      }
   };

   return (
      <div className="flex flex-col flex-grow bg-[#282a36] rounded-r-md">
         <div className="w-full">
            <div className="flex border-b border-[#44475a] bg-[#21222c] overflow-x-auto">
               {navItems.map((item) => (
                  <button
                     key={item.key}
                     onClick={() => setSelectedNav(item.key)}
                     className={`border-r border-[#44475a] p-2 pr-10 px-4 flex items-center gap-2 text-sm flex-shrink-0 font-medium ${
                        selectedNav === item.key
                           ? "bg-[#282a36] text-[#f8f8f2]"
                           : "bg-[#21222c] hover:bg-[#44475a] text-[#6272a4]"
                     }`}
                  >
                     <span className="text-[#8be9fd] drop-shadow-[0_0_0.5px_currentColor] text-lg">
                        <CiFileOn /> 
                     </span>
                     {item.name}
                     {item.key === "pedidos" && (
                        <span className="w-2 h-2 bg-amber-200 rounded-full "></span>
                     )}
                  </button>
               ))}
            </div>
            <div className="w-full border-b border-[#44475a] py-2 gap-3 flex text-xs">
               <span className="text-[#6272a4] ml-6">dashboard</span> 
               <span className="text-[#6272a4]">{">"}</span> 
               <span className="text-[#f8f8f2]">
                  {selectedItem?.name || "Selecione um item"} 
               </span>
            </div>
            <div className="p-6">
               <h1 className="text-2xl font-bold text-[#f8f8f2]">
                  Bem-vindo, {user?.displayName || "Admin"}!
               </h1>
               {renderContent()} 
            </div>
         </div>
      </div>
   );
};

export default function AdminPage() {
   const { user } = useAuth();

   const [selectedIcon, setSelectedIcon] = useState("file");

   const [selectedNav, setSelectedNav] = useState("visao-geral");

   return (
      <div className="flex w-screen h-screen font-sans text-white bg-[#191a21]">
         <div className="flex m-3 rounded-md flex-grow overflow-hidden">
            <SidebarIcons
               selectedIcon={selectedIcon}
               setSelectedIcon={setSelectedIcon}
            />
            <SidebarNav
               user={user}
               selectedNav={selectedNav}
               setSelectedNav={setSelectedNav}
            />
            <MainContent
               user={user}
               selectedNav={selectedNav}
               setSelectedNav={setSelectedNav}
            />
         </div>
      </div>
   );
}
