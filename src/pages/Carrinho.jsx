import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

// Importando componentes do Shadcn
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
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
import { Separator } from "../components/ui/separator";

// Importe o componente AddressForm aqui
import { AddressForm } from "../components/AddressForm";

export default function Carrinho() {
   const { user } = useAuth();
   const {
      cartItems,
      cartLoading,
      removeItemFromCart,
      updateItemQuantity,
      clearCart,
   } = useCart();

   const [enderecos, setEnderecos] = useState([]);
   const [enderecosLoading, setEnderecosLoading] = useState(true);
   const [enderecosError, setEnderecosError] = useState("");
   const [selectedEnderecoId, setSelectedEnderecoId] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

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
   const [selectedFreteOptionId, setSelectedFreteOptionId] = useState(null);

   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
   const backendUrl = import.meta.env.VITE_API_URL;
   const fetchEnderecos = async () => {
      setEnderecosLoading(true);
      setEnderecosError("");
      try {
         const response = await fetch(
            `${backendUrl}/api/enderecos?userId=${user.uid}`
         );
         if (!response.ok) throw new Error("Erro ao carregar endereços.");
         const data = await response.json();
         setEnderecos(data);
         if (data && data.length > 0) {
            setSelectedEnderecoId(data[0].id);
            calculateFreteOptions(data[0].cep);
         } else {
            setSelectedEnderecoId(null);
            setAvailableFreteOptions([]);
            setSelectedFreteOptionId(null);
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

   const subtotalComDesconto = useMemo(() => {
      return totalItens - totalItens * descontoPercentual;
   }, [totalItens, descontoPercentual]);

   const selectedFreteOptionInfo = useMemo(() => {
      return availableFreteOptions.find(
         (option) => option.id === selectedFreteOptionId
      );
   }, [availableFreteOptions, selectedFreteOptionId]);

   const valorFrete = selectedFreteOptionInfo?.value || 0;

   const totalFinal = useMemo(() => {
      return subtotalComDesconto + valorFrete;
   }, [subtotalComDesconto, valorFrete]);

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

   const handleEnderecoSelection = (enderecoSelecionado) => {
      setSelectedEnderecoId(enderecoSelecionado.id);
      if (enderecoSelecionado.cep) {
         calculateFreteOptions(enderecoSelecionado.cep);
      }
      setIsModalOpen(false);
   };

   const handleRetiradaSelection = () => {
      setSelectedEnderecoId("retirada");
      setAvailableFreteOptions([
         {
            id: "retirada",
            name: "Retirada na loja",
            value: 0,
            prazo: "Imediato",
            carrier: "Loja Física",
            address: "Rua Prates, 194, São Paulo, São Paulo, 12345-678, Brasil",
         },
      ]);
      setSelectedFreteOptionId("retirada");
      setFreteIsLoading(false);
      setFreteError("");
   };

   const selectedEndereco = useMemo(() => {
      if (selectedEnderecoId === "retirada") return null;
      return enderecos.find((end) => end.id === selectedEnderecoId);
   }, [enderecos, selectedEnderecoId]);

   const defaultEndereco = useMemo(() => {
      return enderecos.length > 0 ? enderecos[0] : null;
   }, [enderecos]);

   const retiradaNaLojaInfo = {
      id: "retirada",
      name: "Retirada na loja",
      value: 0,
      prazo: "Imediato (horário comercial)",
      carrier: "Loja Física",
      address: "Rua Prates, 194, São Paulo, São Paulo, 12345-678, Brasil",
   };

   const isRetiradaSelected = selectedEnderecoId === "retirada";

   const enderecoDeEntregaExibido = useMemo(() => {
      if (selectedEndereco) {
         return selectedEndereco;
      }
      return defaultEndereco;
   }, [selectedEndereco, defaultEndereco]);

   if (cartItems.length === 0) {
      return (
         <div className="mx-auto my-8 max-w-8xl px-4 sm:px-6 lg:px-8 text-center pt-[4.25rem]">
            <h1 className="text-4xl font-bold mb-6">
               Seu carrinho está vazio 😔
            </h1>
            <p className="text-lg text-gray-600">
               Parece que você ainda não adicionou nenhum item. Que tal dar uma
               olhada nas nossas novidades?
            </p>
            <Link to="/produtos" className="mt-6 inline-block">
               <Button className="bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">
                  Explorar produtos
               </Button>
            </Link>
         </div>
      );
   }

   const handleAddAddressClick = () => {
      setIsModalOpen(true);
      setIsAddingNewAddress(true);
   };

   return (
      <div className="mx-auto my-8 max-w-8xl px-4 sm:px-6 lg:px-8 pt-[4.25rem]">
         <h1 className="text-4xl font-bold mb-6 text-center lg:text-start w-full">
            Confirmar Pedido
         </h1>

         <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/5 order-2 lg:order-1 ">
               {enderecosLoading ? (
                  <p className="text-center">Carregando endereços...</p>
               ) : enderecos.length === 0 ? (
                  <div className="my-8 p-6 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg shadow-sm text-center">
                     <p className="font-semibold text-lg mb-2">
                        ⚠️ Atenção: É necessário cadastrar um endereço para
                        calcular o frete e finalizar a compra.
                     </p>
                     <Button
                        onClick={handleAddAddressClick}
                        className="mt-4 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                     >
                        Adicionar um Endereço
                     </Button>
                     {/* ⭐ REMOVIDO: O botão para a opção de retirada foi removido daqui. */}
                     {/* O usuário deve adicionar um endereço para prosseguir. */}
                  </div>
               ) : (
                  <>
                     <h2 className="text-xl font-semibold mb-4 text-center lg:text-start ">
                        Selecione o método de entrega
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div
                           onClick={() => {
                              if (defaultEndereco) {
                                 handleEnderecoSelection(defaultEndereco);
                              }
                           }}
                           className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                              !isRetiradaSelected
                                 ? "border-amber-500 bg-amber-50 shadow-md"
                                 : "border-gray-300 hover:bg-gray-50"
                           }`}
                        >
                           <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                 <span
                                    className={`h-4 w-4 rounded-full border border-gray-400 flex items-center justify-center ${
                                       !isRetiradaSelected ? "bg-amber-500" : ""
                                    }`}
                                 >
                                    {!isRetiradaSelected && (
                                       <span className="h-2 w-2 rounded-full bg-white"></span>
                                    )}
                                 </span>
                                 <p className="font-semibold text-base">
                                    Entrega
                                 </p>
                              </div>
                           </div>
                           {enderecoDeEntregaExibido && (
                              <div className="mt-2 text-sm text-gray-700">
                                 <p>
                                    {enderecoDeEntregaExibido.rua},{" "}
                                    {enderecoDeEntregaExibido.numero} -{" "}
                                    {enderecoDeEntregaExibido.bairro}
                                 </p>
                                 <p>
                                    {enderecoDeEntregaExibido.cidade}{" "}
                                    {enderecoDeEntregaExibido.estado},{" "}
                                    {enderecoDeEntregaExibido.cep}
                                 </p>
                              </div>
                           )}
                           <Separator className="my-2" />
                           <Button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setIsModalOpen(true);
                              }}
                              className="text-black hover:underline cursor-pointer bg-transparent hover:bg-transparent shadow-none border-none"
                              size="sm"
                           >
                              Mudar
                           </Button>
                        </div>

                        <div
                           onClick={handleRetiradaSelection}
                           className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 flex items-start flex-col justify-center ${
                              isRetiradaSelected
                                 ? "border-amber-500 bg-amber-50 shadow-md"
                                 : "border-gray-300 hover:bg-gray-50"
                           }`}
                        >
                           <div className="flex items-center space-x-2">
                              <span
                                 className={`h-4 w-4 rounded-full border border-gray-400 flex items-center justify-center ${
                                    isRetiradaSelected ? "bg-amber-500" : ""
                                 }`}
                              >
                                 {isRetiradaSelected && (
                                    <span className="h-2 w-2 rounded-full bg-white"></span>
                                 )}
                              </span>
                              <p className="font-semibold text-base">
                                 Retirar na loja
                              </p>
                           </div>
                           <div className="mt-2 text-sm text-gray-700">
                              <p>{retiradaNaLojaInfo.address}</p>
                           </div>
                        </div>
                     </div>

                     {selectedEnderecoId && (
                        <>
                           {!isRetiradaSelected && (
                              <div className="w-full mt-8">
                                 <FreteResultado
                                    selectedFreteOptionInfo={
                                       selectedFreteOptionInfo
                                    }
                                    availableFreteOptions={
                                       availableFreteOptions
                                    }
                                    onSelectFreteOption={
                                       setSelectedFreteOptionId
                                    }
                                    isLoading={freteIsLoading}
                                    error={freteError}
                                    cep={selectedEndereco?.cep || ""}
                                 />
                              </div>
                           )}

                           <div className="flex flex-col md:hidden items-center my-6 justify-between flex-wrap ">
                              <CupomDesconto
                                 cupom={cupom}
                                 setCupom={setCupom}
                                 aplicarCupom={aplicarCupom}
                              />
                              <ResumoCarrinho
                                 totalItens={totalItens}
                                 valorFrete={valorFrete}
                                 totalFinal={totalFinal}
                                 descontoPercentual={descontoPercentual}
                                 cuponsAplicados={cuponsAplicados}
                              />
                           </div>

                           <div className="hidden md:flex items-center my-6 justify-between md:mb-12 flex-col xl:flex-row gap-4">
                              <CupomDesconto
                                 cupom={cupom}
                                 setCupom={setCupom}
                                 aplicarCupom={aplicarCupom}
                              />
                              <ResumoCarrinho
                                 totalItens={totalItens}
                                 valorFrete={valorFrete}
                                 totalFinal={totalFinal}
                                 descontoPercentual={descontoPercentual}
                                 cuponsAplicados={cuponsAplicados}
                              />
                           </div>
                        </>
                     )}
                  </>
               )}
               <div className=" w-full flex justify-center gap-6 items-center flex-wrap">
                  <CheckoutMP
                     cartItems={cartItems}
                     selectedEndereco={selectedEndereco}
                     selectedFreteOption={selectedFreteOptionInfo}
                     isPaymentProcessing={isPaymentProcessing}
                     setIsPaymentProcessing={setIsPaymentProcessing}
                     onPaymentRedirect={clearCart}
                  />
                  <AcoesCarrinhoContinue />
               </div>
            </div>

            <div className="w-full lg:w-2/5 mt-8 lg:mt-0 order-1 lg:order-2">
               <h2 className="text-xl font-semibold mb-4 text-center lg:text-start">
                  Resumo
               </h2>
               {cartLoading ? (
                  <p className="text-gray-600 text-center">
                     Carregando carrinho...
                  </p>
               ) : (
                  <div className="max-h-[41rem] overflow-y-auto border rounded-sm">
                     <TabelaItensCarrinho
                        itens={cartItems}
                        atualizarQuantidade={handleUpdateQuantity}
                        removerDoCarrinho={(item) => {
                           removeItemFromCart(item.id, item.cor, item.tamanho);
                        }}
                     />
                  </div>
               )}
            </div>
         </div>

         <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
               setIsModalOpen(open);
               if (!open) {
                  setIsAddingNewAddress(false);
               }
            }}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>
                     {isAddingNewAddress
                        ? "Adicionar Novo Endereço"
                        : "Selecione um Endereço"}
                  </DialogTitle>
                  <DialogDescription>
                     {isAddingNewAddress
                        ? "Preencha os campos abaixo para adicionar um novo endereço."
                        : "Escolha um dos endereços cadastrados para a entrega."}
                  </DialogDescription>
               </DialogHeader>

               {isAddingNewAddress ? (
                  <AddressForm
                     onAddressAdded={() => {
                        fetchEnderecos();
                        setIsAddingNewAddress(false);
                     }}
                     onClose={() => setIsAddingNewAddress(false)}
                     userId={user?.uid}
                     enderecoParaEditar={null}
                  />
               ) : (
                  <>
                     <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                        {enderecos.map((endereco) => (
                           <div
                              key={endereco.id}
                              onClick={() => handleEnderecoSelection(endereco)}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                 selectedEnderecoId === endereco.id
                                    ? "border-amber-500 bg-amber-50 shadow-md"
                                    : "border-gray-300 hover:bg-gray-50"
                              }`}
                           >
                              <p className="font-semibold">{endereco.nome}</p>
                              <p>
                                 {endereco.rua}, {endereco.numero} -{" "}
                                 {endereco.bairro}
                              </p>
                              <p>
                                 {endereco.cidade}, {endereco.estado},{" "}
                                 {endereco.cep}
                              </p>
                           </div>
                        ))}
                     </div>
                     <div className="mt-4 flex justify-end ">
                        <Button
                           onClick={() => setIsAddingNewAddress(true)}
                           className={
                              "bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                           }
                        >
                           Adicionar novo endereço
                        </Button>
                     </div>
                  </>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
}
