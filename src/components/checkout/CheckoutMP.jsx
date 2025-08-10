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
   // ⭐ NOVO: A URL do seu webhook ngrok.
   // Lembre-se de substituir esta URL a cada nova sessão do ngrok.
   const ngrokWebhookUrl = "https://a4d945f7c508.ngrok-free.app/webhook";

   useEffect(() => {
      if (publicKey) {
         initMercadoPago(publicKey, { locale: "pt-BR" });
      }
   }, [publicKey]);

   const handleFinalizarCompra = async () => {
      // Sai da função se o pagamento já estiver em processo
      if (isPaymentProcessing) return;

      // Validação principal: verifica o carrinho, frete e endereço
      if (cartItems.length === 0) {
         toast.error("Seu carrinho está vazio.");
         return;
      }

      // Validação central corrigida e combinada para evitar erros.
      // Se a opção de frete não existe, ou se não é "retirada" e o endereço não está selecionado.
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

            window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=${result.id}`;
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

   return (
      <div>
         <button
            onClick={handleFinalizarCompra}
            // Esta lógica já é eficiente para desabilitar o botão até que
            // a opção de frete seja selecionada.
            disabled={isPaymentProcessing || !selectedFreteOption}
            className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed p-3 cursor-pointer"
         >
            {isPaymentProcessing ? "Processando..." : "Finalizar Compra"}
         </button>
      </div>
   );
}
