// src/components/checkout/CheckoutMP.jsx
import React, { useState } from "react"; // Removed useEffect
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; // ⭐ NOVO: Importa o useNavigate para redirecionar

export function CheckoutMP({
   cartItems,
   selectedEndereco,
   selectedFreteOption,
   isPaymentProcessing,
   setIsPaymentProcessing,
}) {
   const [preferenceId, setPreferenceId] = useState(null);
   const { user } = useAuth();
   const navigate = useNavigate(); // ⭐ NOVO: Instancia o hook
   const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

   if (!publicKey) {
      console.error("A chave pública do Mercado Pago não foi encontrada.");
      return <div>Erro: Chave de pagamento não configurada.</div>;
   }

   initMercadoPago(publicKey, { locale: "pt-BR" });

   // ⭐ ALTERADO: Lógica movida para uma função que será chamada pelo botão ⭐
   const handleFinalizarCompra = async () => {
      // ... (sua validação original)
      if (isPaymentProcessing || preferenceId) return;

      if (cartItems.length === 0) {
         toast.error("Seu carrinho está vazio.");
         return;
      }

      if (!selectedEndereco) {
         toast.error("Por favor, selecione um endereço de entrega.");
         return;
      }

      setIsPaymentProcessing(true);
      toast.info("Criando seu pedido, aguarde...");

      try {
         const requestBody = {
            items: cartItems,
            payer: {
               id: user.uid, // ⭐ NOVO: Adicione o user.uid para o back-end associar o pedido ao usuário
               name: selectedEndereco.nomeCompleto,
               lastname: selectedEndereco.sobrenome,
               email: user?.email,
            },
            shipping: {
               cost: selectedFreteOption.value,
               option: selectedFreteOption,
            },
            selectedEnderecoId: selectedEndereco.id, // ⭐ NOVO: Envie o ID do endereço selecionado
         };

         const response = await fetch(
            `${import.meta.env.VITE_API_URL}/create_preference`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(requestBody),
            }
         );

         const result = await response.json();

         if (response.ok && result.id) {
            setPreferenceId(result.id);
         } else {
            console.error("Erro na resposta da API:", result);
            toast.error(
               `Erro ao criar o pedido: ${result.error || "Tente novamente."}`
            );
         }
      } catch (error) {
         console.error("Erro ao criar preferência:", error);
         toast.error("Não foi possível conectar ao servidor de pagamento.");
      } finally {
         setIsPaymentProcessing(false);
      }
   };

   return (
      <div className="mt-4">
         {/* ⭐ ALTERADO: O botão agora chama a função 'handleFinalizarCompra' ⭐ */}
         {!preferenceId && (
            <button
               onClick={handleFinalizarCompra}
               disabled={isPaymentProcessing || !selectedFreteOption}
               className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isPaymentProcessing
                  ? "Processando..."
                  : "Finalizar Compra com Mercado Pago"}
            </button>
         )}

         {/* ⭐ Este bloco só aparece após a preferência ser criada com sucesso ⭐ */}
         {preferenceId && (
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
               <p className="text-gray-700 mb-4">
                  Finalize sua compra no ambiente seguro do Mercado Pago:
               </p>
               <Wallet initialization={{ preferenceId }} />
            </div>
         )}
      </div>
   );
}
