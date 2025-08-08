// src/pages/Carrinho.jsx
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

import { InfoCarrinho } from "../components/Carrinho/InfoCarrinho";
import TabelaItensCarrinho from "../components/Carrinho/TabelaItensCarrinho";
import CupomDesconto from "../components/Carrinho/CupomDesconto";
import ResumoCarrinho from "../components/Carrinho/ResumoCarrinho";
import FreteCEP from "../components/Carrinho/FreteCEP";
import { CheckoutMP } from "../components/checkout/CheckoutMP"; // Importe o componente

import {
   AcoesCarrinhoContinue,
   AcoesCarrinhoFinish,
} from "../components/Carrinho/AcoesCarrinho"; // Importação nomeada correta
import FreteResultado from "../components/Carrinho/FreteResultado";

export default function Carrinho() {
   const { cartItems, cartLoading, removeItemFromCart, updateItemQuantity } =
      useCart();

   const cuponsValidos = [
      { nomeDoCupom: "PRIMEIRA", descontoTotal: 0.1 },
      { nomeDoCupom: "BOASVINDAS", descontoTotal: 0.05, minimoCompra: 300 },
      { nomeDoCupom: "TESTE", descontoTotal: 0.05, minimoCompra: 6300 },
   ];

   const [cupom, setCupom] = useState("");
   const [cuponsAplicados, setCuponsAplicados] = useState([]);

   // Estados para gerenciar o frete
   const [cep, setCep] = useState("");
   const [freteIsLoading, setFreteIsLoading] = useState(false);
   const [freteError, setFreteError] = useState("");
   const [availableFreteOptions, setAvailableFreteOptions] = useState([]); // Opções de frete calculadas
   const [selectedFreteOptionId, setSelectedFreteOptionId] = useState(null); // ID da opção de frete selecionada

   const descontoPercentual = cuponsAplicados.reduce(
      (acc, cupom) => acc + cupom.descontoTotal,
      0
   );

   const totalItens = cartItems.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
   );

   // Encontra a informação completa da opção de frete selecionada
   const selectedFreteOptionInfo = useMemo(() => {
      return availableFreteOptions.find(
         (option) => option.id === selectedFreteOptionId
      );
   }, [availableFreteOptions, selectedFreteOptionId]);

   // Calcula o valor total final, incluindo o frete
   const totalFinal = useMemo(() => {
      let currentTotal = totalItens - totalItens * descontoPercentual;
      if (
         selectedFreteOptionInfo &&
         selectedFreteOptionInfo.value !== undefined
      ) {
         currentTotal += selectedFreteOptionInfo.value;
      }
      return currentTotal;
   }, [totalItens, descontoPercentual, selectedFreteOptionInfo]);

   const aplicarCupom = () => {
      const cupomFormatado = cupom.trim().toUpperCase();
      const cupomEncontrado = cuponsValidos.find(
         (c) => c.nomeDoCupom === cupomFormatado
      );
      toast.dismiss();
      if (!cupomEncontrado) {
         toast.error(" Cupom inválido");
         return;
      }
      if (
         cupomEncontrado.minimoCompra &&
         totalItens < cupomEncontrado.minimoCompra
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
      setCupom("");
   };

   const handleCepChange = (newCepValue) => {
      setCep(newCepValue);
      // Limpar resultados de frete anteriores quando o CEP muda
      setAvailableFreteOptions([]);
      setSelectedFreteOptionId(null);
      setFreteError("");
   };

   const calculateFreteOptions = async () => {
      setFreteIsLoading(true);
      setAvailableFreteOptions([]);
      setSelectedFreteOptionId(null);
      setFreteError("");

      const cleanCep = cep.replace(/\D/g, "");

      if (cleanCep.length !== 8) {
         toast.error("Por favor, informe um CEP válido com 8 dígitos.");
         setFreteIsLoading(false);
         return;
      }

      try {
         await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula delay

         const options = [];

         // Opção de Retirada (agora com categoria e endereço)
         options.push({
            id: "retirada",
            name: "Retirada na loja",
            value: 0,
            prazo: "Imediato (horário comercial)",
            carrier: "Loja Física",
            category: "retirada",
            address: "Rua Prates, 194, São Paulo, São Paulo, 12345-678, Brasil",
         });

         // Simulação Correios (PAC)
         let fretePadraoValue = null;
         let fretePadraoPrazo = null;
         const maricaCEPRangePrefix = "249"; // Prefixo de CEP para Maricá e região

         if (cleanCep.startsWith(maricaCEPRangePrefix)) {
            // Dentro da área de Maricá
            fretePadraoValue = 15.0; // Valor ajustado conforme a imagem
            fretePadraoPrazo = "3-5 dias úteis"; // Prazo ajustado conforme a imagem
         } else if (cleanCep.startsWith("2") || cleanCep.startsWith("0")) {
            // Outros CEPs no estado do RJ ou SP (exemplo)
            fretePadraoValue = 25.0;
            fretePadraoPrazo = "5-9 dias úteis";
         } else {
            // Demais regiões
            fretePadraoValue = 40.0;
            fretePadraoPrazo = "7-15 dias úteis";
         }

         options.push({
            id: "frete-padrao", // ID mais específico
            name: "Frete padrão", // Nome ajustado conforme a imagem
            value: fretePadraoValue,
            prazo: fretePadraoPrazo,
            carrier: "Correios",
            category: "frete",
         });

         // Simulação Uber Flash / Entrega Rápida
         let entregaRapidaValue = null;
         let entregaRapidaPrazo = null;

         if (cleanCep.startsWith(maricaCEPRangePrefix)) {
            entregaRapidaValue = 50.0; // Valor ajustado conforme a imagem
            entregaRapidaPrazo = "até 2 dias úteis"; // Prazo ajustado conforme a imagem
         } else if (
            (cleanCep.startsWith("240") ||
               cleanCep.startsWith("241") ||
               cleanCep.startsWith("242") ||
               cleanCep.startsWith("243") ||
               cleanCep.startsWith("244")) && // Niterói, São Gonçalo
            totalItens >= 200 // Condição: apenas para compras de valor mais alto
         ) {
            entregaRapidaValue = 75.0; // Exemplo de valor mais alto para cidades próximas
            entregaRapidaPrazo = "até 2 dias úteis";
         }

         if (entregaRapidaValue) {
            options.push({
               id: "entrega-rapida", // ID mais específico
               name: "Entrega rápida", // Nome ajustado conforme a imagem
               value: entregaRapidaValue,
               prazo: entregaRapidaPrazo,
               carrier: "Uber Flash / Transportadora",
               category: "frete",
            });
         }

         setAvailableFreteOptions(options);
         if (options.length > 0) {
            // Tenta selecionar a opção mais barata por padrão
            const cheapestOption = options.reduce((min, current) =>
               current.value < min.value ? current : min
            );
            setSelectedFreteOptionId(cheapestOption.id);
         }
         toast.success("Opções de frete carregadas!");
      } catch (err) {
         console.error("Erro ao buscar fretes:", err);
         const message =
            err.message || "Não foi possível buscar opções de frete.";
         setFreteError(message);
         toast.error(message);
      } finally {
         setFreteIsLoading(false);
      }
   };

   const handleUpdateQuantity = (itemParaAtualizar, operacao) => {
      const newQuantity =
         operacao === "somar"
            ? itemParaAtualizar.quantidade + 1
            : Math.max(1, itemParaAtualizar.quantidade - 1);

      updateItemQuantity(
         itemParaAtualizar.id,
         newQuantity,
         itemParaAtualizar.cor,
         itemParaAtualizar.tamanho
      );
   };

   const hasValidCep = cep.replace(/\D/g, "").length === 8;

   return (
      <div className="px-6 mx-auto md:mt-8 mt-8 max-w-6xl">
         <h1 className="text-2xl font-bold mb-6 text-center">Seu Carrinho</h1>

         {cartLoading ? (
            <p className="text-gray-600 text-center">Carregando carrinho...</p>
         ) : cartItems.length === 0 ? (
            <p className="text-gray-600 text-center">O carrinho está vazio.</p>
         ) : (
            <TabelaItensCarrinho
               itens={cartItems}
               atualizarQuantidade={handleUpdateQuantity}
               removerDoCarrinho={(item) => {
                  removeItemFromCart(item.id, item.cor, item.tamanho);
               }}
            />
         )}

         {cartItems.length > 0 && (
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
               <div className="flex flex-col md:flex-row md:items-start justify-start md:justify-between md:mt-0 mt-8 gap-8">
                  {/* FreteCEP agora ocupa sua própria seção */}
                  <FreteCEP
                     cep={cep}
                     handleChange={handleCepChange}
                     onCalculateFrete={calculateFreteOptions}
                     isCalculatingFrete={freteIsLoading}
                     hasValidCep={hasValidCep}
                  />
               </div>
               <div className="w-full md:w-auto flex flex-col items-center">
                  {" "}
                  {/* Este div agrupa os resultados do frete e os botões de ação */}
                  <div className="w-full">
                     <FreteResultado
                        selectedFreteOptionInfo={selectedFreteOptionInfo}
                        availableFreteOptions={availableFreteOptions}
                        onSelectFreteOption={setSelectedFreteOptionId}
                        isLoading={freteIsLoading}
                        error={freteError}
                        cep={cep}
                     />
                  </div>
                  {/* Renderiza AcoesCarrinho apenas se houver opções de frete */}
                  {selectedFreteOptionId ? (
                     // ✨ Mostra o botão de pagamento do MP apenas quando o frete é selecionado
                     <div className="mt-8 w-full flex justify-center">
                        <CheckoutMP />
                     </div>
                  ) : (
                     // ✨ Mostra o botão de continuar comprando se o frete ainda não foi selecionado
                     <div className="flex flex-col items-center justify-center gap-4 w-full my-8">
                        <AcoesCarrinhoContinue />
                     </div>
                  )}
               </div>
            </>
         )}
      </div>
   );
}
