// src/components/MinhaConta.jsx
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
   FaTruck,
   FaMapMarkerAlt,
   FaLock,
   FaHeadset,
   FaSignOutAlt,
   FaEdit,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogClose,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/AddressForm";
import moment from "moment";
import "moment/locale/pt-br";
import { toast } from "sonner";

// =======================================================
// ⭐ COMPONENTES INDIVIDUAIS PARA CADA SEÇÃO DA CONTA ⭐
// =======================================================
export function Enderecos() {
   const { user } = useAuth();
   const [enderecos, setEnderecos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [enderecoParaEditar, setEnderecoParaEditar] = useState(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [enderecoIdToDelete, setEnderecoIdToDelete] = useState(null);

   const fetchEnderecos = async () => {
      if (!user) return;
      setLoading(true);
      try {
         const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/enderecos?userId=${user.uid}`
         );
         if (!response.ok) {
            throw new Error("Erro ao buscar endereços");
         }
         const data = await response.json();
         setEnderecos(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   const handleRemoveClick = (id) => {
      setEnderecoIdToDelete(id);
      setIsDeleteModalOpen(true);
   };

   const confirmRemove = async () => {
      if (!enderecoIdToDelete) return;
      try {
         const response = await fetch(
            `${
               import.meta.env.VITE_API_URL
            }/api/enderecos/${enderecoIdToDelete}`,
            {
               method: "DELETE",
            }
         );

         if (!response.ok) {
            throw new Error("Erro ao remover endereço");
         }
         await fetchEnderecos();
         toast.success("Endereço removido com sucesso!");
      } catch (err) {
         setError(err.message);
         toast.error(err.message);
      } finally {
         setIsDeleteModalOpen(false);
         setEnderecoIdToDelete(null);
      }
   };

   const handleEdit = (endereco) => {
      setEnderecoParaEditar(endereco);
      setIsModalOpen(true);
   };

   const handleAdd = () => {
      setEnderecoParaEditar(null);
      setIsModalOpen(true);
   };

   useEffect(() => {
      if (user) {
         fetchEnderecos();
      }
   }, [user]);

   if (loading) {
      return <div className="p-4">Carregando endereços...</div>;
   }

   if (error) {
      return <div className="p-4 text-red-600">Erro: {error}</div>;
   }

   return (
      <div className="p-4">
         <h2 className="text-xl font-bold mb-4">Meus endereços</h2>

         {enderecos.length === 0 ? (
            <p className="mb-4">Você ainda não tem endereços cadastrados.</p>
         ) : (
            <ul className="space-y-2 mb-4">
               {enderecos.map((end) => (
                  <li
                     key={end.id}
                     className="border rounded-md p-3 flex flex-col justify-between items-start"
                  >
                     <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                           <div className="flex items-center gap-16">
                              <span className="font-semibold">
                                 {end.nomeCompleto} {end.sobrenome}
                              </span>
                              <span className="text-sm text-gray-600">
                                 Celular: {end.celular}
                              </span>
                           </div>
                           <span>
                              {end.rua}, {end.numero} - {end.bairro}
                           </span>
                           <span>
                              {end.cidade}/{end.uf} - {end.cep}
                           </span>
                           <span className="font-semibold text-sm border px-2 py-1 rounded-md my-2 w-fit">
                              {end.localizacao}
                           </span>
                        </div>
                        <div className="flex gap-3 items-center">
                           <button
                              className="text-gray-500 hover:text-amber-600 transition cursor-pointer text-xl"
                              onClick={() => handleEdit(end)}
                           >
                              <FaEdit />
                           </button>
                           <button
                              className="text-gray-500 hover:text-red-600 transition cursor-pointer text-xl"
                              onClick={() => handleRemoveClick(end.id)}
                           >
                              <FaXmark />
                           </button>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         )}

         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
               <Button
                  onClick={handleAdd}
                  className="bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
               >
                  Adicionar novo endereço
               </Button>
            </DialogTrigger>
            <DialogContent className="">
               <DialogHeader>
                  <DialogTitle>
                     {enderecoParaEditar
                        ? "Editar endereço"
                        : "Adicionar novo endereço"}
                  </DialogTitle>
                  <DialogDescription>
                     {enderecoParaEditar
                        ? "Edite os campos abaixo para atualizar seu endereço."
                        : "Preencha os campos abaixo para salvar um novo endereço de entrega."}
                  </DialogDescription>
               </DialogHeader>
               <div className="py-4">
                  <AddressForm
                     onAddressAdded={fetchEnderecos}
                     onClose={() => setIsModalOpen(false)}
                     userId={user?.uid}
                     enderecoParaEditar={enderecoParaEditar}
                  />
               </div>
            </DialogContent>
         </Dialog>

         <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                  <DialogDescription>
                     Tem certeza que deseja remover este endereço? Esta ação não
                     pode ser desfeita.
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <p className="text-sm text-gray-500">
                     A exclusão do endereço é permanente.
                  </p>
               </div>
               <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <Button
                     onClick={confirmRemove}
                     variant="destructive"
                     className="bg-red-600 hover:bg-red-700"
                  >
                     Confirmar Exclusão
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}

function Pedidos() {
   const { user } = useAuth();
   const [pedidos, setPedidos] = useState([]);
   const [loading, setLoading] = useState(true); // ⭐ CORREÇÃO: Adicionada a verificação para garantir que pedidoId não seja nulo.

   const handleRePagamento = async (pedidoId) => {
      if (!pedidoId) {
         toast.error("Erro: ID do pedido não encontrado.");
         return;
      }

      try {
         const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}/re-pagar`
         );
         const data = await response.json();
         if (!response.ok) {
            toast.error(data.error);
            return;
         }
         if (data.preferenceId) {
            const redirectUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=${data.preferenceId}`;
            window.location.href = redirectUrl;
         } else {
            toast.error("Não foi possível obter os dados de pagamento.");
         }
      } catch (error) {
         console.error("Erro ao re-pagar pedido:", error);
         toast.error("Ocorreu um erro. Tente novamente.");
      }
   };

   useEffect(() => {
      const fetchPedidos = async () => {
         if (!user) {
            setPedidos([]);
            setLoading(false);
            return;
         }
         try {
            const response = await fetch(
               `${import.meta.env.VITE_API_URL}/api/pedidos?userId=${user.uid}`
            );
            if (!response.ok) {
               throw new Error("Falha ao buscar pedidos.");
            }
            const data = await response.json();
            setPedidos(data);
         } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            toast.error("Não foi possível carregar o histórico de pedidos.");
         } finally {
            setLoading(false);
         }
      };
      fetchPedidos();
   }, [user]);

   if (loading) {
      return <div className="text-center mt-8">Carregando seus pedidos...</div>;
   }

   if (!loading && pedidos.length === 0) {
      return (
         <div className="flex flex-col p-4 ">
                       
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                              Meus Pedidos            
            </h2>
                       
            <div className="bg-white p-6 rounded-lg shadow-md text-center w-auto">
                              
               <p className="text-gray-600">
                                    Você ainda não tem pedidos. Suas compras ira
                                 
               </p>
                              
               <Link
                  to="/"
                  className="text-blue-600 hover:underline mt-2 inline-block"
               >
                                    Ir as compras                
               </Link>
                          
            </div>
                     
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4">
                  
         <h2 className="text-2xl font-bold mb-6 text-gray-800">Meus Pedidos</h2>
                  
         <div className="space-y-6">
                       
            {pedidos.map((pedido) => (
               <div
                  key={pedido.id}
                  className="bg-white p-6 rounded-lg shadow-md"
               >
                                   
                  <div className="flex justify-between items-center border-b pb-4 mb-4 gap-2 flex-col md:flex-row">
                                          
                     <div>
                                               
                        <p className="font-semibold text-gray-900">
                                                      Pedido #{pedido.id}       
                                          
                        </p>
                                               
                        <p className="text-sm text-gray-500">
                                                      Data do pedido:          
                                            
                           {moment(pedido.dataCriacao).format(
                              "DD[/]MM [de] YYYY [às] HH:mm"
                           )}
                                                  
                        </p>
                                             
                     </div>
                                          
                     <div className="text-right">
                                               
                        <span
                           className={`px-3 py-1 rounded-full text-xs font-bold ${
                              pedido.status === "aprovado"
                                 ? "bg-green-100 text-green-800"
                                 : pedido.status === "rejeitado"
                                 ? "bg-red-100 text-red-800"
                                 : "bg-yellow-100 text-yellow-800"
                           }`}
                        >
                                                      
                           {pedido.status === "pending" ||
                           pedido.status === "pendente"
                              ? "PENDENTE"
                              : pedido.status
                              ? pedido.status.toUpperCase()
                              : "DESCONHECIDO"}
                                                  
                        </span>
                                             
                     </div>
                                      
                  </div>
                                   
                  <div className="space-y-4">
                                          
                     {pedido.items &&
                        pedido.items.map((item, index) => (
                           <div
                              key={index}
                              className="flex items-center space-x-4 "
                           >
                                                           
                              <img
                                 src={item.image}
                                 alt={item.title}
                                 className="w-16 h-16 object-cover rounded-md"
                              />
                                                           
                              <div className="flex-1">
                                                                  
                                 <p className="font-medium text-gray-900 ">
                                                                       
                                    {item.title}                               
                                     
                                 </p>
                                                                  
                                 <p className="text-sm text-gray-600 flex gap-1">
                                                                       
                                    <span className="">Quantidade:</span>       
                                                               
                                    <span className="font-semibold">
                                                                              
                                       {item.quantity}                         
                                                
                                    </span>
                                                                     
                                 </p>
                                                              
                              </div>
                                                           
                              <p className="font-semibold text-gray-900">
                                                                  R$            
                                                      
                                 {(item.unit_price * item.quantity).toFixed(2)} 
                                                            
                              </p>
                                                         
                           </div>
                        ))}
                                      
                  </div>
                                    <Separator className="my-4" />             
                     
                  <div className="flex justify-between items-center flex-wrap gap-2 flex-col sm:flex-row">
                                          
                     {pedido.shipping && pedido.shipping.option && (
                        <div className="text-sm text-gray-700 flex flex-col">
                                                      
                           <span className="font-semibold">
                                                            Método de Envio:    
                                                     
                           </span>
                                                      
                           {pedido.shipping.option.name} (                      
                                {pedido.shipping.option.carrier})              
                                    
                        </div>
                     )}
                                          
                     <div className="text-right flex-1">
                                               
                        <p className="text-lg font-bold text-gray-900">
                                                      Total: R$                
                                      
                           {pedido.total ? pedido.total.toFixed(2) : "0.00"}   
                                              
                        </p>
                                             
                     </div>
                                      
                  </div>
                                   
                  {(pedido.status === "pendente" ||
                     pedido.status === "pending") && (
                     <div className="mt-4 w-full flex sm:justify-end justify-center">
                                               
                        <button
                           onClick={() => handleRePagamento(pedido.id)}
                           className="w-auto p-2 bg-amber-600 text-white font-semibold rounded-lg cursor-pointer hover:bg-amber-700 transition duration-300"
                        >
                                                      Pagar Agora              
                                    
                        </button>
                                             
                     </div>
                  )}
                                 
               </div>
            ))}
                     
         </div>
              
      </div>
   );
}

function Seguranca() {
   const [senhaAtual, setSenhaAtual] = useState("");
   const [novaSenha, setNovaSenha] = useState("");
   const [mensagem, setMensagem] = useState("");

   function alterarSenha(e) {
      e.preventDefault();
      setMensagem("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
   }

   return (
      <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">Login e segurança</h2> 
                
         <form onSubmit={alterarSenha} className="space-y-3 max-w-sm">
                       
            <input
               type="password"
               placeholder="Senha atual"
               value={senhaAtual}
               onChange={(e) => setSenhaAtual(e.target.value)}
               className="border rounded px-2 py-1 w-full"
               required
            />
                       
            <input
               type="password"
               placeholder="Nova senha"
               value={novaSenha}
               onChange={(e) => setNovaSenha(e.target.value)}
               className="border rounded px-2 py-1 w-full"
               required
            />
                       
            <button
               type="submit"
               className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 w-full"
            >
                              Alterar senha            
            </button>
                       
            {mensagem && <p className="text-green-600">{mensagem}</p>}         
         </form>
              
      </div>
   );
}

// =======================================================
// ⭐ COMPONENTE PRINCIPAL (MinhaConta) com NAV LATERAL ⭐
// =======================================================

export default function MinhaConta() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();
   const query = new URLSearchParams(location.search);
   const tabSelecionada = query.get("tab") || "pedidos"; // Removido o estado 'isSidebarOpen' e seus modificadores // para evitar duplicação de menu hambúrguer

   const opcoes = [
      {
         path: "pedidos",
         icon: <FaTruck className="text-lg" />,
         label: "Meus pedidos",
      },
      {
         path: "enderecos",
         icon: <FaMapMarkerAlt className="text-lg" />,
         label: "Meus endereços",
      },
      {
         path: "seguranca",
         icon: <FaLock className="text-lg" />,
         label: "Login e segurança",
      },
   ];

   function renderConteudo() {
      switch (tabSelecionada) {
         case "pedidos":
            return <Pedidos />;
         case "enderecos":
            return <Enderecos />;
         case "seguranca":
            return <Seguranca />;
         default:
            return <Pedidos />;
      }
   }

   return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-4.3rem)] bg-white mt-[4.25rem]">
                  
         {/* Removido o botão de menu hambúrguer e o overlay para mobile */}   
              {/* NAV LATERAL - Visível apenas no desktop */}         
         <nav className="hidden md:flex flex-col w-[20%] max-w-[300px] p-6 shadow-xl">
                       
            <div className="mb-6 md:mb-4">
                              
               <h1 className="text-2xl font-bold mb-1">Minha Conta</h1>         
                    
               <p className="text-sm text-gray-600">
                                    {user?.displayName}, <br /> {user?.email}   
                             
               </p>
                          
            </div>
                        <Separator />           
            <div className="flex flex-col flex-grow overflow-y-auto mt-4">
                              
               <div className="flex flex-col space-y-2">
                                   
                  {opcoes.map((item) => (
                     <Link
                        key={item.path}
                        to={`/minha-conta?tab=${item.path}`}
                        className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded transition select-none
                                    ${
                           tabSelecionada === item.path
                              ? "bg-gray-100 font-semibold"
                              : "hover:bg-gray-50 text-gray-800 font-medium"
                        }`}
                     >
                                               
                        <span className="shadow bg-white rounded p-1 text-amber-600">
                                                      {item.icon}               
                                  
                        </span>
                                                <span>{item.label}</span>       
                                     
                     </Link>
                  ))}
                                 
               </div>
                              <Separator className="my-4" />               
               <div className="flex flex-col space-y-2">
                                   
                  <button
                     type="button"
                     onClick={() => alert("Abrindo suporte...")}
                     className="flex items-center gap-2 text-start rounded transition px-3 py-2 cursor-pointer hover:bg-gray-100 font-medium"
                     aria-label="Suporte"
                  >
                                          
                     <FaHeadset className="shadow bg-white rounded p-1 text-amber-600 text-2xl" />
                                          <span>Suporte</span>                 
                  </button>
                                   
                  <button
                     type="button"
                     onClick={logout}
                     className="flex items-center gap-2 text-start rounded transition px-3 py-2 cursor-pointer hover:bg-gray-100 font-medium"
                     aria-label="Sair"
                  >
                                          
                     <FaSignOutAlt className="shadow bg-white rounded p-1 text-amber-600 text-2xl" />
                                          <span>Sair</span>                 
                  </button>
                                 
               </div>
                          
            </div>
                     
         </nav>
                
         <div className="flex-1 overflow-y-auto w-full p-4 md:p-6">
                                  {renderConteudo()}         
         </div>
      </div>
   );
}
