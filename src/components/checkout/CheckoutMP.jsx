// src/components/checkout/CheckoutMP.jsx

import React, { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function CheckoutMP({
   cartItems,
   selectedEndereco,
   selectedFreteOption,
   isPaymentProcessing,
   setIsPaymentProcessing,
}) {
   const [preferenceId, setPreferenceId] = useState(null);
   const { user } = useAuth();
   const { clearCart } = useCart();
   const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

   useEffect(() => {
      if (publicKey) {
         initMercadoPago(publicKey, { locale: "pt-BR" });
      }
   }, [publicKey]);

   const handleFinalizarCompra = async () => {
      if (isPaymentProcessing) return;
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

      const orderId = uuidv4();

      try {
         const requestBody = {
            items: cartItems,
            payer: {
               id: user.uid,
               name: selectedEndereco.nomeCompleto,
               lastname: selectedEndereco.sobrenome,
               email: user?.email,
            },
            shipping: {
               cost: selectedFreteOption.value,
               option: selectedFreteOption,
            },
            selectedEnderecoId: selectedEndereco.id,
            external_reference: orderId,
         };

         const response = await fetch(
            `${import.meta.env.VITE_API_URL}/create_preference`,
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(requestBody),
            }
         );

         const result = await response.json();

         // A MUDANÇA CRÍTICA ESTÁ AQUI:
         // SÓ PROSSEGUIMOS SE A API RETORNAR SUCESSO E O ID DA PREFERÊNCIA
         if (response.ok && result.id) {
            console.log("✅ Pedido criado com sucesso! ID:", orderId);
            console.log(
               "✅ Preferência do Mercado Pago criada com sucesso! ID:",
               result.id
            );

            setPreferenceId(result.id);
            clearCart();

            toast.success(
               "Pedido criado com sucesso! Redirecionando para o pagamento."
            );
         } else {
            console.error("❌ Erro ao criar o pedido ou preferência:", result);
            toast.error(
               `Erro ao criar o pedido: ${result.error || "Tente novamente."}`
            );
         }
      } catch (error) {
         console.error("❌ Erro de conexão com o servidor:", error);
         toast.error("Não foi possível conectar ao servidor de pagamento.");
      } finally {
         setIsPaymentProcessing(false);
      }
   };

   return (
      <div>
         {!preferenceId && (
            <button
               onClick={handleFinalizarCompra}
               disabled={isPaymentProcessing || !selectedFreteOption}
               className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed p-3 cursor-pointer"
            >
               {isPaymentProcessing
                  ? "Processando..."
                  : "Finalizar Compra com Mercado Pago"}
            </button>
         )}

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
