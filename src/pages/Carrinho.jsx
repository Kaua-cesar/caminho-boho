import { useEffect, useState } from "react";
import {
   getCarrinho,
   removerDoCarrinho,
   salvarCarrinho,
} from "../utils/carrinho";
import { FaSearchDollar, FaTruck } from "react-icons/fa";

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

   const atualizarQuantidade = (id, operacao) => {
      const atualizado = itens.map((item) => {
         if (item.id === id) {
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
   const [mensagem, setMensagem] = useState("");
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

      if (!cupomEncontrado) {
         setMensagem("❌ Cupom inválido");
         return;
      }
      // Verifica valor mínimo, se definido
      if (
         cupomEncontrado.minimoCompra &&
         total < cupomEncontrado.minimoCompra
      ) {
         setMensagem(
            `❌ Este cupom só é válido para compras acima de R$${cupomEncontrado.minimoCompra}`
         );
         return;
      }
      // Verifica se o cupom já foi aplicado
      if (cuponsAplicados.some((c) => c.nomeDoCupom === cupomFormatado)) {
         setMensagem("❌ Você já aplicou esse cupom");
         return;
      }

      // Limite de 2 cupons aplicados
      if (cuponsAplicados.length >= 2) {
         setMensagem("❌ Limite de 2 cupons aplicados");
         return;
      }

      // Aplica o cupom
      setCuponsAplicados((prev) => [...prev, cupomEncontrado]);
      setMensagem("✅ Cupom aplicado com sucesso!");
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
      <div className="p-6 mx-auto mt-20 max-w-6xl">
         <h1 className="text-2xl font-bold mb-6 text-center">Seu Carrinho</h1>

         {itens.length === 0 ? (
            <p className="text-gray-600 text-center">O carrinho está vazio.</p>
         ) : (
            <TabelaItensCarrinho
               itens={itens}
               atualizarQuantidade={atualizarQuantidade}
               removerDoCarrinho={(id) => {
                  removerDoCarrinho(id);
                  setItens(getCarrinho());
               }}
            />
         )}

         <div className="flex items-center my-6 justify-between mb-14">
            <CupomDesconto
               cupom={cupom}
               setCupom={setCupom}
               aplicarCupom={aplicarCupom}
               mensagem={mensagem}
            />
            <ResumoCarrinho totalFinal={totalFinal} />
         </div>

         {itens.length > 0 && (
            <>
               <div className="flex justify-between flex-col md:flex-row gap-4 mb-6">
                  <div>
                     <p className="flex items-center gap-2">
                        <FaSearchDollar className="text-3xl text-amber-600" />
                        Ver as formas de pagamento e parcelamento
                     </p>
                     <p className="flex items-center gap-2">
                        <FaTruck className="text-3xl text-amber-600" />
                        Preencha o campo CEP para calcular o valor do frete e o
                        prazo
                     </p>
                  </div>
               </div>
               <div className="flex justify-between">
                  <FreteCEP cep={cep} handleChange={handleChange} />
                  <AcoesCarrinho />
               </div>
            </>
         )}
      </div>
   );
}
