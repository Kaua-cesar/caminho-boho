import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
   FaTruck,
   FaMapMarkerAlt,
   FaLock,
   FaCreditCard,
   FaHeart,
   FaHeadset,
   FaSignOutAlt,
} from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext"; // ajuste o caminho se necessário
import { Card } from "../Card"; // ajuste o caminho se necessário
import { produtos } from "../components/Cards/CardDados"; // ajuste o caminho se necessário

// Exemplo de dados mockados (substitua por dados reais do backend)
const pedidosMock = [
   { id: 1, status: "Entregue", total: 199.9, data: "01/08/2025" },
   { id: 2, status: "Em transporte", total: 89.5, data: "15/07/2025" },
];

const enderecosMock = [
   { id: 1, rua: "Rua das Flores, 123", cidade: "Rio de Janeiro", uf: "RJ" },
];

const cartoesMock = [
   { id: 1, bandeira: "Visa", final: "1234", validade: "12/28" },
];

// Função para exibir pedidos
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
                        Total: <b>R${pedido.total.toFixed(2)}</b> | Data:{" "}
                        {pedido.data}
                     </span>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}

// Função para exibir e editar endereços
function Enderecos() {
   const [enderecos, setEnderecos] = useState(enderecosMock);
   const [novoEndereco, setNovoEndereco] = useState("");

   function adicionarEndereco() {
      if (novoEndereco.trim() === "") return;
      setEnderecos([
         ...enderecos,
         { id: Date.now(), rua: novoEndereco, cidade: "Cidade", uf: "UF" },
      ]);
      setNovoEndereco("");
   }

   return (
      <div className="p-4">
         <h2 className="text-xl font-bold mb-4">Meus endereços</h2>
         <ul className="space-y-2 mb-4">
            {enderecos.map((end) => (
               <li
                  key={end.id}
                  className="border rounded p-3 flex justify-between items-center"
               >
                  <span>
                     {end.rua} - {end.cidade}/{end.uf}
                  </span>
                  <button
                     className="text-red-600 hover:underline"
                     onClick={() =>
                        setEnderecos(enderecos.filter((e) => e.id !== end.id))
                     }
                  >
                     Remover
                  </button>
               </li>
            ))}
         </ul>
         <div className="flex gap-2">
            <input
               type="text"
               value={novoEndereco}
               onChange={(e) => setNovoEndereco(e.target.value)}
               placeholder="Novo endereço"
               className="border rounded px-2 py-1 flex-1"
            />
            <button
               onClick={adicionarEndereco}
               className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
            >
               Adicionar
            </button>
         </div>
      </div>
   );
}

// Função para alterar senha (exemplo)
function Seguranca() {
   const [senhaAtual, setSenhaAtual] = useState("");
   const [novaSenha, setNovaSenha] = useState("");
   const [mensagem, setMensagem] = useState("");

   function alterarSenha(e) {
      e.preventDefault();
      // Aqui você faria a chamada para o backend
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

// Função para exibir cartões salvos
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
         {/* Aqui você pode adicionar um formulário para adicionar novo cartão */}
      </div>
   );
}

// Função para exibir favoritos reais
function Favoritos() {
   const { favorites, favoritesLoading } = useFavorites();

   // Garante que favorites é sempre um array de string
   const favoritosArray = Array.isArray(favorites) ? favorites.map(String) : [];
   const produtosArray = Array.isArray(produtos) ? produtos : [];

   // Veja o que está vindo
   console.log("favorites:", favoritosArray);
   console.log("produtos:", produtosArray);

   // Filtra os produtos favoritos (comparando como string)
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
               {user.displayName}, Email: {user.email}
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
