import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
   FaTruck,
   FaMapMarkerAlt,
   FaLock,
   FaCreditCard,
   FaHeart,
   FaHeadset,
   FaSignOutAlt,
   FaEdit,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useFavorites } from "../context/FavoritesContext";
import { Card } from "../Card";
import { produtos } from "../components/Cards/CardDados";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/AddressForm"; // Importe o novo componente

// Exemplo de dados mockados para Pedidos e Cartões, mantidos por enquanto
const pedidosMock = [
   { id: 1, status: "Entregue", total: 199.9, data: "01/08/2025" },
   { id: 2, status: "Em transporte", total: 89.5, data: "15/07/2025" },
];

const cartoesMock = [
   { id: 1, bandeira: "Visa", final: "1234", validade: "12/28" },
];

function Pedidos() {
   const [pedidos] = useState(pedidosMock);

   return (
      <div className="p-4">
         <h2 className="text-xl font-bold mb-4">Meus pedidos</h2>
         {pedidos.length === 0 ? (
            <p>Você ainda não fez nenhum pedido.</p>
         ) : (
            <ul className="space-y-2">
               {pedidos.map((pedido) => (
                  <li
                     key={pedido.id}
                     className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                     <span>
                        <b>Pedido #{pedido.id}</b> - {pedido.status}
                     </span>
                     <span>
                        Total:
                        <b>R${pedido.total.toFixed(2)}</b> | Data:
                        {pedido.data}
                     </span>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

function Enderecos() {
   const { user } = useAuth();
   const [enderecos, setEnderecos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [enderecoParaEditar, setEnderecoParaEditar] = useState(null); // Estado para o endereço sendo editado

   const fetchEnderecos = async () => {
      if (!user) return;
      setLoading(true);
      try {
         const response = await fetch(
            `http://localhost:3001/api/enderecos?userId=${user.uid}`
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

   const removerEndereco = async (id) => {
      try {
         const response = await fetch(
            `http://localhost:3001/api/enderecos/${id}`,
            {
               method: "DELETE",
            }
         );

         if (!response.ok) {
            throw new Error("Erro ao remover endereço");
         }

         await fetchEnderecos();
      } catch (err) {
         setError(err.message);
      }
   };

   // Nova função para abrir o modal de edição
   const handleEdit = (endereco) => {
      setEnderecoParaEditar(endereco);
      setIsModalOpen(true);
   };

   // Nova função para abrir o modal de adição
   const handleAdd = () => {
      setEnderecoParaEditar(null); // Garante que o formulário está em modo de adição
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
            <p>Você ainda não tem endereços cadastrados.</p>
         ) : (
            <ul className="space-y-2 mb-4">
               {enderecos.map((end) => (
                  <li
                     key={end.id}
                     className="border rounded p-3 flex flex-col justify-between items-start"
                  >
                     <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                           <span className="font-semibold">
                              {end.nomeCompleto} {end.sobrenome}
                           </span>
                           <span>
                              {end.nome}: {end.rua} - {end.cidade}/{end.uf} -{" "}
                              {end.cep}
                           </span>
                        </div>
                        <div className="flex gap-3 items-center">
                           {/* Botão de edição */}
                           <button
                              className="text-gray-500 hover:text-amber-600 transition cursor-pointer text-xl"
                              onClick={() => handleEdit(end)}
                           >
                              <FaEdit />
                           </button>
                           {/* Botão de remoção */}
                           <button
                              className="text-gray-500 hover:text-red-600 transition cursor-pointer text-xl"
                              onClick={() => removerEndereco(end.id)}
                           >
                              <FaXmark />
                           </button>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         )}

         {/* Abertura do modal para Adicionar ou Editar */}
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
                     enderecoParaEditar={enderecoParaEditar} // Passa o endereço para o formulário
                  />
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}

// O restante dos componentes e a exportação permanecem os mesmos
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

function Pagamentos() {
   const [cartoes, setCartoes] = useState(cartoesMock);

   function removerCartao(id) {
      setCartoes(cartoes.filter((c) => c.id !== id));
   }

   return (
      <div className="p-4">
         <h2 className="text-xl font-bold mb-4">Meus cartões</h2>
         {cartoes.length === 0 ? (
            <p>Nenhum cartão salvo.</p>
         ) : (
            <ul className="space-y-2">
               {cartoes.map((cartao) => (
                  <li
                     key={cartao.id}
                     className="border rounded p-3 flex justify-between items-center"
                  >
                     <span>
                        {cartao.bandeira} final {cartao.final} - validade{" "}
                        {cartao.validade}
                     </span>
                     <button
                        className="text-red-600 hover:underline"
                        onClick={() => removerCartao(cartao.id)}
                     >
                        Remover
                     </button>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

function Favoritos() {
   const { favorites, favoritesLoading } = useFavorites();
   const favoritosArray = Array.isArray(favorites) ? favorites.map(String) : [];
   const produtosArray = Array.isArray(produtos) ? produtos : [];

   const produtosFavoritos = produtosArray.filter((produto) =>
      favoritosArray.includes(String(produto.id))
   );

   if (favoritesLoading) {
      return (
         <div className="flex items-center justify-center flex-col min-h-[300px]">
            <p className="text-lg text-gray-600 animate-pulse">
               Carregando seus produtos favoritos...
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center w-full">
         <h2 className="text-2xl font-bold mb-6">Itens salvos</h2>
         {produtosFavoritos.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg shadow-sm bg-gray-50 max-w-lg mx-auto">
               <p className="text-xl text-gray-700 mb-4">
                  💖 Sua lista de favoritos está vazia!
               </p>
               <p className="text-md text-gray-600 mb-6">
                  Explore nossos produtos e clique no coração para adicionar aos
                  favoritos.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
               {produtosFavoritos.map((produto) => (
                  <Card
                     key={produto.id}
                     {...produto}
                     preco={produto.preco ?? produto.precoOriginal}
                  />
               ))}
            </div>
         )}
      </div>
   );
}

export default function MinhaConta() {
   const { user, logout } = useAuth();
   const [selecionado, setSelecionado] = useState(0);

   const opcoes = [
      { icon: <FaTruck className="text-lg" />, label: "Meus pedidos" },
      { icon: <FaMapMarkerAlt className="text-lg" />, label: "Meus endereços" },
      { icon: <FaLock className="text-lg" />, label: "Login e segurança" },
      { icon: <FaCreditCard className="text-lg" />, label: "Pagamentos" },
      { icon: <FaHeart className="text-lg" />, label: "Itens salvos" },
   ];

   function renderConteudo() {
      switch (selecionado) {
         case 0:
            return <Pedidos />;
         case 1:
            return <Enderecos />;
         case 2:
            return <Seguranca />;
         case 3:
            return <Pagamentos />;
         case 4:
            return <Favoritos />;
         default:
            return null;
      }
   }

   return (
      <div className="w-full flex flex-row flex-1 p-6 bg-white rounded shadow min-h-[calc(100vh-68px)]">
         {/* Menu lateral */}
         <div className="w-1/5 pr-5 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
            <p className="text-sm">
               {user?.displayName}, Email: {user?.email}
            </p>
            <div className="space-y-4 mt-8 flex-1 flex flex-col">
               <div className="flex flex-col space-y-2 flex-1">
                  {opcoes.map((item, index) => (
                     <div
                        key={index}
                        onClick={() => setSelecionado(index)}
                        className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded transition select-none
                ${
                   selecionado === index
                      ? "bg-gray-100 font-semibold"
                      : "hover:bg-gray-50 text-gray-800 font-medium"
                }`}
                        role="button"
                        aria-pressed={selecionado === index}
                     >
                        <span className="shadow bg-white rounded p-1 text-amber-600">
                           {item.icon}
                        </span>
                        <span>{item.label}</span>
                     </div>
                  ))}
               </div>
               <Separator />
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
         </div>
         {/* Conteúdo dinâmico */}
         <div className="w-4/5 pl-6 flex flex-col flex-1 min-h-full">
            {renderConteudo()}
         </div>
      </div>
   );
}
