import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
   getCarrinho,
   removerDoCarrinho,
   salvarCarrinho,
} from "../utils/carrinho";
import { InfoCarrinho } from "../components/Carrinho/InfoCarrinho";

import TabelaItensCarrinho from "../components/Carrinho/TabelaItensCarrinho";
import CupomDesconto from "../components/Carrinho/CupomDesconto";
import ResumoCarrinho from "../components/Carrinho/ResumoCarrinho";
import FreteCEP from "../components/Carrinho/FreteCEP";
import AcoesCarrinho from "../components/Carrinho/AcoesCarrinho";

export default function Carrinho() {
   const [itens, setItens] = useState([]);

   useEffect(() => {
      setItens(getCarrinho());

      function atualizar() {
         setItens(getCarrinho());
      }

      window.addEventListener("carrinhoAtualizado", atualizar);
      return () => window.removeEventListener("carrinhoAtualizado", atualizar);
   }, []);

   const atualizarQuantidade = (itemParaAtualizar, operacao) => {
      const atualizado = itens.map((item) => {
         if (
            item.id === itemParaAtualizar.id &&
            item.cor === itemParaAtualizar.cor &&
            item.tamanho === itemParaAtualizar.tamanho
         ) {
            const novaQtd =
               operacao === "somar"
                  ? item.quantidade + 1
                  : Math.max(1, item.quantidade - 1);
            return { ...item, quantidade: novaQtd };
         }
         return item;
      });

      setItens(atualizado);
      salvarCarrinho(atualizado);
      window.dispatchEvent(new Event("carrinhoAtualizado"));
   };

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

   const total = itens.reduce(
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

   return (
      <div className="p-6 mx-auto md:mt-20 mt-16 max-w-6xl">
         <h1 className="text-2xl font-bold mb-6 text-center">Seu Carrinho</h1>

         {itens.length === 0 ? (
            <p className="text-gray-600 text-center">O carrinho está vazio.</p>
         ) : (
            <TabelaItensCarrinho
               itens={itens}
               atualizarQuantidade={atualizarQuantidade}
               removerDoCarrinho={(item) => {
                  removerDoCarrinho(item);
                  setItens(getCarrinho());
               }}
            />
         )}

         {itens.length > 0 && (
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
