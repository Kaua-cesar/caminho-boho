// src/pages/Carrinho.jsx
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { InfoCarrinho } from "../components/Carrinho/InfoCarrinho";
import TabelaItensCarrinho from "../components/Carrinho/TabelaItensCarrinho";
import CupomDesconto from "../components/Carrinho/CupomDesconto";
import ResumoCarrinho from "../components/Carrinho/ResumoCarrinho";
import { CheckoutMP } from "../components/checkout/CheckoutMP";
import {
   AcoesCarrinhoContinue,
   AcoesCarrinhoFinish,
} from "../components/Carrinho/AcoesCarrinho";
import FreteResultado from "../components/Carrinho/FreteResultado";

// Componente para selecionar o endereço
function FreteEndereco({
   enderecos,
   selectedEnderecoId,
   onSelectEndereco,
   isLoading,
   error,
}) {
   if (isLoading) {
      return <p className="text-gray-600">Carregando endereços...</p>;
   }
   if (error) {
      return (
         <p className="text-red-600">Erro ao carregar endereços: {error}</p>
      );
   }
   if (!enderecos || enderecos.length === 0) {
      return (
         <p className="text-gray-600">
                        Você não tem endereços salvos. Adicione em{" "}
            <a href="/minha-conta" className="text-blue-600 hover:underline">
                              Minha Conta        
            </a>
            .          
         </p>
      );
   }

   return (
      <div className="flex flex-col gap-2 w-full max-w-sm">
                  
         <p className="font-bold">
                        Selecione o endereço para o cálculo do frete:          
         </p>
                  
         {enderecos.map((endereco) => (
            <label
               key={endereco.id}
               className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                  selectedEnderecoId === endereco.id
                     ? "border-amber-600 bg-amber-50"
                     : "border-gray-300"
               }`}
            >
                              
               <input
                  type="radio"
                  name="endereco"
                  value={endereco.id}
                  checked={selectedEnderecoId === endereco.id}
                  onChange={() => onSelectEndereco(endereco)}
                  className="form-radio text-amber-600"
               />
                              
               <span>
                                    {endereco.nome} ({endereco.cep})            
                     
               </span>
                          {" "}
            </label>
         ))}
              {" "}
      </div>
   );
}

export default function Carrinho() {
   const { user } = useAuth();
   const { cartItems, cartLoading, removeItemFromCart, updateItemQuantity } =
      useCart();

   const [enderecos, setEnderecos] = useState([]);
   const [enderecosLoading, setEnderecosLoading] = useState(true);
   const [enderecosError, setEnderecosError] = useState("");
   const [selectedEnderecoId, setSelectedEnderecoId] = useState(null);

   const cuponsValidos = [
      { nomeDoCupom: "PRIMEIRA", descontoTotal: 0.1 },
      { nomeDoCupom: "BOASVINDAS", descontoTotal: 0.05, minimoCompra: 300 },
      { nomeDoCupom: "TESTE", descontoTotal: 0.05, minimoCompra: 6300 },
   ];

   const [cupom, setCupom] = useState("");
   const [cuponsAplicados, setCuponsAplicados] = useState([]);

   const [freteIsLoading, setFreteIsLoading] = useState(false);
   const [freteError, setFreteError] = useState("");
   const [availableFreteOptions, setAvailableFreteOptions] = useState([]);
   const [selectedFreteOptionId, setSelectedFreteOptionId] = useState(null); // ⭐ NOVO ESTADO: Para controlar o botão do Mercado Pago ⭐

   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

   const fetchEnderecos = async () => {
      setEnderecosLoading(true);
      setEnderecosError("");
      try {
         const response = await fetch(
            `http://localhost:3001/api/enderecos?userId=${user.uid}`
         );
         if (!response.ok) throw new Error("Erro ao carregar endereços.");
         const data = await response.json();
         setEnderecos(data); // ⭐ NOVO: Define o primeiro endereço como o selecionado por padrão ⭐
         if (data && data.length > 0) {
            setSelectedEnderecoId(data[0].id); // ⭐ Bônus: Chama o cálculo de frete para o CEP deste endereço ⭐
            calculateFreteOptions(data[0].cep);
         } else {
            setSelectedEnderecoId(null);
         }
      } catch (err) {
         setEnderecosError(err.message);
         toast.error(err.message);
      } finally {
         setEnderecosLoading(false);
      }
   };

   useEffect(() => {
      if (user) {
         fetchEnderecos();
      }
   }, [user]);

   const descontoPercentual = cuponsAplicados.reduce(
      (acc, cupom) => acc + cupom.descontoTotal,
      0
   );

   const totalItens = cartItems.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
   );

   const selectedFreteOptionInfo = useMemo(() => {
      return availableFreteOptions.find(
         (option) => option.id === selectedFreteOptionId
      );
   }, [availableFreteOptions, selectedFreteOptionId]);

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
         toast.error("Cupom inválido");
         return;
      }
      if (
         cupomEncontrado.minimoCompra &&
         totalItens < cupomEncontrado.minimoCompra
      ) {
         toast.error(
            `Este cupom só é válido para compras acima de R$${cupomEncontrado.minimoCompra}`
         );
         return;
      }
      if (cuponsAplicados.some((c) => c.nomeDoCupom === cupomFormatado)) {
         toast.error("Você já aplicou esse cupom");
         return;
      }
      if (cuponsAplicados.length >= 2) {
         toast.error("Limite de 2 cupons aplicados");
         return;
      }

      setCuponsAplicados((prev) => [...prev, cupomEncontrado]);
      toast.success("Cupom aplicado com sucesso!");
      setCupom("");
   };

   const calculateFreteOptions = async (cepParaCalcular) => {
      setFreteIsLoading(true);
      setAvailableFreteOptions([]);
      setSelectedFreteOptionId(null);
      setFreteError("");

      const cleanCep = cepParaCalcular.replace(/\D/g, "");

      if (cleanCep.length !== 8) {
         toast.error("Por favor, informe um CEP válido com 8 dígitos.");
         setFreteIsLoading(false);
         return;
      }

      try {
         await new Promise((resolve) => setTimeout(resolve, 1500));

         const options = [];

         options.push({
            id: "retirada",
            name: "Retirada na loja",
            value: 0,
            prazo: "Imediato (horário comercial)",
            carrier: "Loja Física",
            category: "retirada",
            address: "Rua Prates, 194, São Paulo, São Paulo, 12345-678, Brasil",
         });

         let fretePadraoValue = null;
         let fretePadraoPrazo = null;
         const maricaCEPRangePrefix = "249";
         if (cleanCep.startsWith(maricaCEPRangePrefix)) {
            fretePadraoValue = 15.0;
            fretePadraoPrazo = "3-5 dias úteis";
         } else if (cleanCep.startsWith("2") || cleanCep.startsWith("0")) {
            fretePadraoValue = 25.0;
            fretePadraoPrazo = "5-9 dias úteis";
         } else {
            fretePadraoValue = 40.0;
            fretePadraoPrazo = "7-15 dias úteis";
         }

         options.push({
            id: "frete-padrao",
            name: "Frete padrão",
            value: fretePadraoValue,
            prazo: fretePadraoPrazo,
            carrier: "Correios",
            category: "frete",
         });

         let entregaRapidaValue = null;
         let entregaRapidaPrazo = null;
         if (cleanCep.startsWith(maricaCEPRangePrefix)) {
            entregaRapidaValue = 50.0;
            entregaRapidaPrazo = "até 2 dias úteis";
         } else if (
            (cleanCep.startsWith("240") ||
               cleanCep.startsWith("241") ||
               cleanCep.startsWith("242") ||
               cleanCep.startsWith("243") ||
               cleanCep.startsWith("244")) &&
            totalItens >= 200
         ) {
            entregaRapidaValue = 75.0;
            entregaRapidaPrazo = "até 2 dias úteis";
         }

         if (entregaRapidaValue) {
            options.push({
               id: "entrega-rapida",
               name: "Entrega rápida",
               value: entregaRapidaValue,
               prazo: entregaRapidaPrazo,
               carrier: "Uber Flash / Transportadora",
               category: "frete",
            });
         }

         setAvailableFreteOptions(options);
         if (options.length > 0) {
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

   const handleEnderecoSelection = (enderecoSelecionado) => {
      setSelectedEnderecoId(enderecoSelecionado.id);
      if (enderecoSelecionado.cep) {
         calculateFreteOptions(enderecoSelecionado.cep);
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
                                   {" "}
                  <CupomDesconto
                     cupom={cupom}
                     setCupom={setCupom}
                     aplicarCupom={aplicarCupom}
                  />
                                    <ResumoCarrinho totalFinal={totalFinal} /> 
                               
               </div>
                              <InfoCarrinho />               
               <div className="flex flex-col md:flex-row md:items-start justify-start md:justify-between md:mt-0 mt-8 gap-8">
                                   {" "}
                  <FreteEndereco
                     enderecos={enderecos}
                     selectedEnderecoId={selectedEnderecoId}
                     onSelectEndereco={handleEnderecoSelection}
                     isLoading={enderecosLoading}
                     error={enderecosError}
                  />
                                 
               </div>
                              
               <div className="w-full md:w-auto flex flex-col items-center">
                                   {" "}
                  <div className="w-full">
                                          
                     <FreteResultado
                        selectedFreteOptionInfo={selectedFreteOptionInfo}
                        availableFreteOptions={availableFreteOptions}
                        onSelectFreteOption={setSelectedFreteOptionId}
                        isLoading={freteIsLoading}
                        error={freteError}
                        cep={
                           enderecos.find(
                              (end) => end.id === selectedEnderecoId
                           )?.cep || ""
                        }
                     />
                                      {" "}
                  </div>
                                   {" "}
                  {selectedFreteOptionId ? (
                     <div className="my-8 w-full flex justify-center gap-6 items-center">
                        {/* ⭐ NOVO: Passe as props necessárias para o CheckoutMP ⭐ */}
                        <CheckoutMP
                           cartItems={cartItems}
                           selectedEndereco={enderecos.find(
                              (end) => end.id === selectedEnderecoId
                           )}
                           selectedFreteOption={selectedFreteOptionInfo}
                           isPaymentProcessing={isPaymentProcessing}
                           setIsPaymentProcessing={setIsPaymentProcessing}
                        />
                        <div className="flex items-center justify-center gap-4 w-auto">
                           <AcoesCarrinhoContinue />
                        </div>
                                       
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center gap-4 w-full my-8">
                                                 <AcoesCarrinhoContinue />     
                                       
                     </div>
                  )}
                                 
               </div>
                          {" "}
            </>
         )}
              {" "}
      </div>
   );
}
