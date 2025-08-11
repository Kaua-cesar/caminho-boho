// src/components/checkout/CheckoutMP.jsx
import React, { useState, useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function CheckoutMP({
   cartItems,
   selectedEndereco,
   selectedFreteOption,
   isPaymentProcessing,
   setIsPaymentProcessing,
   onPaymentRedirect,
}) {
   const { user } = useAuth();
   const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
   const backendUrl = import.meta.env.VITE_API_URL;
   const ngrokWebhookUrl = "https://a4d945f7c508.ngrok-free.app/webhook";

   // ⭐ NOVO ESTADO: Adicionamos um estado para verificar se o Mercado Pago está pronto.
   const [mercadoPagoReady, setMercadoPagoReady] = useState(false);

   useEffect(() => {
      if (publicKey) {
         // ⭐ CORREÇÃO: Chamamos initMercadoPago sem .then(), pois ele não retorna uma Promise.
         // Ele simplesmente inicia o processo de carregamento do script.
         initMercadoPago(publicKey, {
            locale: "pt-BR",
            advancedFraudPrevention: true,
         });

         // Verificamos a cada 100ms se a função de checkout está disponível.
         // Isso é uma forma robusta de lidar com o carregamento assíncrono do script.
         const checkInterval = setInterval(() => {
            if (window.MercadoPago && window.MercadoPago.checkout) {
               console.log("SDK do Mercado Pago inicializado com sucesso.");
               setMercadoPagoReady(true);
               clearInterval(checkInterval); // Paramos de verificar quando estiver pronto.
            }
         }, 100);

         // Limpeza do intervalo quando o componente for desmontado
         return () => clearInterval(checkInterval);
      }
   }, [publicKey]);

   const handleFinalizarCompra = async () => {
      // Sai da função se o pagamento já estiver em processo ou se o SDK não estiver pronto.
      if (isPaymentProcessing || !mercadoPagoReady) {
         console.log("Mercado Pago não está pronto. Abortando a compra.");
         toast.info("Aguarde, a biblioteca de pagamento está carregando...");
         return;
      }

      if (cartItems.length === 0) {
         toast.error("Seu carrinho está vazio.");
         return;
      }

      if (
         !selectedFreteOption ||
         (selectedFreteOption.id !== "retirada" && !selectedEndereco)
      ) {
         toast.error(
            "Por favor, selecione um endereço de entrega ou a opção de retirada local."
         );
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
               name: selectedEndereco
                  ? selectedEndereco.nomeCompleto
                  : user?.displayName || user?.email,
               lastname: selectedEndereco ? selectedEndereco.sobrenome : "",
               email: user?.email,
            },
            shipping: {
               cost: selectedFreteOption.value,
               option: selectedFreteOption,
            },
            selectedEnderecoId: selectedEndereco?.id || selectedFreteOption?.id,
            external_reference: orderId,
            notification_url: ngrokWebhookUrl,
         };

         const response = await fetch(`${backendUrl}/create_preference`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
         });

         const result = await response.json();

         if (response.ok && result.id) {
            console.log("✅ Pedido criado com sucesso! ID:", orderId);
            console.log(
               "✅ Preferência do Mercado Pago criada com sucesso! ID:",
               result.id
            );

            if (onPaymentRedirect) {
               onPaymentRedirect();
            }

            // A chamada só ocorrerá se o estado 'mercadoPagoReady' for true.
            window.MercadoPago.checkout({
               preference: {
                  id: result.id,
               },
            }).open();

            setIsPaymentProcessing(false);
         } else {
            console.error("❌ Erro ao criar o pedido ou preferência:", result);
            toast.error(
               `Erro ao criar o pedido: ${result.error || "Tente novamente."}`
            );
            setIsPaymentProcessing(false);
         }
      } catch (error) {
         console.error("❌ Erro de conexão com o servidor:", error);
         toast.error("Não foi possível conectar ao servidor de pagamento.");
         setIsPaymentProcessing(false);
      }
   };

   const isButtonDisabled =
      isPaymentProcessing ||
      !selectedFreteOption ||
      !mercadoPagoReady || // ⭐ VERIFICA SE O SDK ESTÁ PRONTO
      (selectedFreteOption.id !== "retirada" && !selectedEndereco);

   return (
      <div>
         <button
            onClick={handleFinalizarCompra}
            disabled={isButtonDisabled}
            className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed p-3 cursor-pointer"
         >
            {isPaymentProcessing ? "Processando..." : "Finalizar Compra"}
         </button>
      </div>
   );
}
