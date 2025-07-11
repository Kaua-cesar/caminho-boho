// src/pages/Carrinho.jsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext"; // <--- AJUSTE ESTE CAMINHO SE NECESSÁRIO

import { InfoCarrinho } from "../components/Carrinho/InfoCarrinho";
import TabelaItensCarrinho from "../components/Carrinho/TabelaItensCarrinho";
import CupomDesconto from "../components/Carrinho/CupomDesconto";
import ResumoCarrinho from "../components/Carrinho/ResumoCarrinho";
import FreteCEP from "../components/Carrinho/FreteCEP";
import AcoesCarrinho from "../components/Carrinho/AcoesCarrinho";

export default function Carrinho() {
   // Agora, obtenha os itens do carrinho e as funções de manipulação do useCart
   const { cartItems, cartLoading, removeItemFromCart, updateItemQuantity } =
      useCart();

   const cuponsValidos = [
      { nomeDoCupom: "PRIMEIRA", descontoTotal: 0.1 },
      { nomeDoCupom: "BOASVINDAS", descontoTotal: 0.05, minimoCompra: 300 },
      { nomeDoCupom: "TESTE", descontoTotal: 0.05, minimoCompra: 6300 },
      // Adicione outros cupons válidos aqui
   ];

   const [cupom, setCupom] = useState("");
   const [cuponsAplicados, setCuponsAplicados] = useState([]);

   // Calcula o desconto somando todos os descontos aplicados
   const descontoPercentual = cuponsAplicados.reduce(
      (acc, cupom) => acc + cupom.descontoTotal,
      0
   );

   const total = cartItems.reduce(
      // Use cartItems diretamente
      (soma, item) => soma + item.preco * item.quantidade,
      0
   );
   const totalFinal = total - total * descontoPercentual;

   const aplicarCupom = () => {
      const cupomFormatado = cupom.trim().toUpperCase();
      const cupomEncontrado = cuponsValidos.find(
         (c) => c.nomeDoCupom === cupomFormatado
      );
      toast.dismiss(); // limpa todos os toasts antes de mostrar um novo
      if (!cupomEncontrado) {
         toast.error(" Cupom inválido");
         return;
      }
      if (
         cupomEncontrado.minimoCompra &&
         total < cupomEncontrado.minimoCompra
      ) {
         toast.error(
            ` Este cupom só é válido para compras acima de R$${cupomEncontrado.minimoCompra}`
         );
         return;
      }
      if (cuponsAplicados.some((c) => c.nomeDoCupom === cupomFormatado)) {
         toast.error(" Você já aplicou esse cupom");
         return;
      }
      if (cuponsAplicados.length >= 2) {
         toast.error(" Limite de 2 cupons aplicados");
         return;
      }

      setCuponsAplicados((prev) => [...prev, cupomEncontrado]);
      toast.success(" Cupom aplicado com sucesso!");
      setCupom(""); // limpa o campo
   };

   const [cep, setCep] = useState("");

   const formatarCep = (valor) => {
      const apenasNumeros = valor.replace(/\D/g, "");
      return apenasNumeros.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
   };

   const handleChange = (e) => {
      const valor = e.target.value;
      setCep(formatarCep(valor));
   };

   // Função para atualizar quantidade, agora usa updateItemQuantity do contexto
   const handleUpdateQuantity = (itemParaAtualizar, operacao) => {
      const newQuantity =
         operacao === "somar"
            ? itemParaAtualizar.quantidade + 1
            : Math.max(1, itemParaAtualizar.quantidade - 1);

      // CORREÇÃO: Passando id, nova quantidade, cor e tamanho
      updateItemQuantity(
         itemParaAtualizar.id,
         newQuantity,
         itemParaAtualizar.cor,
         itemParaAtualizar.tamanho
      );
   };

   return (
      <div className="p-6 mx-auto md:mt-20 mt-16 max-w-6xl">
         <h1 className="text-2xl font-bold mb-6 text-center">Seu Carrinho</h1>

         {cartLoading ? ( // Mostra um loader enquanto o carrinho está sendo carregado
            <p className="text-gray-600 text-center">Carregando carrinho...</p>
         ) : cartItems.length === 0 ? ( // Mostra mensagem de vazio se não houver itens
            <p className="text-gray-600 text-center">O carrinho está vazio.</p>
         ) : (
            <TabelaItensCarrinho
               itens={cartItems} // Use cartItems diretamente
               atualizarQuantidade={handleUpdateQuantity} // Use a nova função que chama o contexto
               removerDoCarrinho={(item) => {
                  // CORREÇÃO: Passando id, cor e tamanho
                  removeItemFromCart(item.id, item.cor, item.tamanho);
               }}
            />
         )}

         {cartItems.length > 0 && ( // Condição baseada em cartItems
            <>
               <div className="flex items-center my-6 justify-between md:mb-14 flex-col md:flex-row">
                  <CupomDesconto
                     cupom={cupom}
                     setCupom={setCupom}
                     aplicarCupom={aplicarCupom}
                  />
                  <ResumoCarrinho totalFinal={totalFinal} />
               </div>
               <InfoCarrinho />
               <div className="flex justify-between md:flex-row flex-col md:mt-0 mt-8">
                  <FreteCEP cep={cep} handleChange={handleChange} />
                  <AcoesCarrinho />
               </div>
            </>
         )}
      </div>
   );
}
