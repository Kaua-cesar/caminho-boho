import React, { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function CheckoutMP() {
   const [preferenceId, setPreferenceId] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const { cartItems } = useCart();
   const { user } = useAuth();

   const [payerData, setPayerData] = useState({
      name: "",
      lastname: "",
      email: "",
   });

   const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

   if (!publicKey) {
      console.error("A chave pública do Mercado Pago não foi encontrada.");
      return <div>Erro: Chave de pagamento não configurada.</div>;
   }

   initMercadoPago(publicKey, { locale: "pt-BR" });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPayerData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handlePayment = async (e) => {
      e.preventDefault();

      if (cartItems.length === 0) {
         toast.error("Seu carrinho está vazio.");
         return;
      }

      if (!payerData.name || !payerData.lastname || !payerData.email) {
         toast.error("Por favor, preencha todos os seus dados.");
         return;
      }

      const externalReference = `REF-${user?.id || "guest"}-${Date.now()}`;

      setIsLoading(true);
      try {
         const requestBody = {
            items: cartItems,
            payer: payerData,
            external_reference: externalReference,
         };

         console.log("Dados enviados para o back-end:", requestBody);

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

         const preference = await response.json();
         if (preference.id) {
            setPreferenceId(preference.id);
         } else if (preference.error) {
            toast.error(
               `Erro do servidor: ${preference.details || preference.error}`
            );
         } else {
            toast.error("Erro ao iniciar o pagamento. Tente novamente.");
         }
      } catch (error) {
         toast.error("Não foi possível conectar ao servidor de pagamento.");
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div>
         <form onSubmit={handlePayment}>
            <h3>Dados do Comprador</h3>
            <input
               type="text"
               name="name"
               placeholder="Nome"
               value={payerData.name}
               onChange={handleInputChange}
               required
            />
            <input
               type="text"
               name="lastname"
               placeholder="Sobrenome"
               value={payerData.lastname}
               onChange={handleInputChange}
               required
            />
            <input
               type="email"
               name="email"
               placeholder="E-mail"
               value={payerData.email}
               onChange={handleInputChange}
               required
            />
            <button type="submit" disabled={isLoading || preferenceId}>
               {isLoading
                  ? "Processando..."
                  : "Finalizar Compra com Mercado Pago"}
            </button>
         </form>
         {preferenceId && <Wallet initialization={{ preferenceId }} />}
      </div>
   );
}
