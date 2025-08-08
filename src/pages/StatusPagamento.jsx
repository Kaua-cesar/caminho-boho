// src/pages/StatusPagamento.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

export default function StatusPagamento() {
   const [searchParams] = useSearchParams();
   const [statusPagamento, setStatusPagamento] = useState("processando");
   const { clearCart, cartItems } = useCart();
   const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

   useEffect(() => {
      const status = searchParams.get("status");
      const pedidoId =
         searchParams.get("external_reference") || searchParams.get("pedidoId");
      const paymentId = searchParams.get("payment_id");

      if (!status) {
         setStatusPagamento("erro");
         toast.error("Não foi possível identificar o status do pagamento.");
         return;
      }

      async function verificarStatusEFinalizar() {
         try {
            // A sua rota de webhook já atualiza o status do pedido no back-end.
            // Agora, o front-end só precisa esperar a confirmação do back-end
            // para exibir o status e limpar o carrinho.

            // Vamos simular uma espera para dar tempo do webhook processar
            // e o Firestore atualizar.
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await fetch(
               `${
                  import.meta.env.VITE_API_URL
               }/api/pedidos?pedidoId=${pedidoId}`
            );

            const data = await response.json();

            if (response.ok && data.status) {
               const statusDoServidor = data.status;

               if (statusDoServidor === "aprovado") {
                  setStatusPagamento("sucesso");
                  if (!pedidoFinalizado) {
                     // Limpa o carrinho apenas uma vez
                     clearCart();
                     setPedidoFinalizado(true);
                  }
                  toast.success("Pagamento aprovado e pedido finalizado!");
               } else if (statusDoServidor === "pendente") {
                  setStatusPagamento("pendente");
                  toast.info("Seu pagamento está pendente.");
               } else if (statusDoServidor === "rejeitado") {
                  setStatusPagamento("erro");
                  toast.error(
                     "Pagamento rejeitado. Seu carrinho foi preservado."
                  );
               }
            } else {
               throw new Error("Erro ao verificar o status do pedido.");
            }
         } catch (error) {
            console.error("Erro ao verificar o status do pedido:", error);
            setStatusPagamento("erro");
            toast.error(
               "Erro ao processar o pedido. Entre em contato com o suporte."
            );
         }
      }

      // Evita chamadas múltiplas
      if (pedidoId && !pedidoFinalizado) {
         verificarStatusEFinalizar();
      } else if (status === "failure") {
         setStatusPagamento("erro");
         toast.error("O pagamento falhou. Tente novamente.");
      }
   }, [searchParams, clearCart, pedidoFinalizado, cartItems]);

   const getMensagemStatus = () => {
      switch (statusPagamento) {
         case "sucesso":
            return {
               titulo: "Pagamento Aprovado! 🎉",
               mensagem:
                  "Seu pedido foi recebido e está sendo processado. Em poucos instantes você receberá um e-mail de confirmação.",
               icone: "✅",
            };
         case "pendente":
            return {
               titulo: "Pagamento Pendente",
               mensagem:
                  "Aguardando a confirmação do pagamento. Verifique seu e-mail para mais detalhes e não feche a página.",
               icone: "⏳",
            };
         case "erro":
            return {
               titulo: "Erro no Pagamento",
               mensagem:
                  "Houve um problema com seu pagamento. Seu carrinho foi preservado. Você pode tentar novamente ou entrar em contato conosco.",
               icone: "❌",
            };
         case "processando":
         default:
            return {
               titulo: "Processando Pagamento...",
               mensagem:
                  "Estamos verificando o status da sua transação. Aguarde um momento.",
               icone: "⚙️",
            };
      }
   };

   const { titulo, mensagem, icone } = getMensagemStatus();

   return (
      <div className="container mx-auto p-6 md:mt-10 max-w-2xl bg-white rounded-lg shadow-xl text-center">
         <h1 className="text-4xl font-bold mb-4">
            {icone} {titulo}
         </h1>
         <p className="text-gray-700 text-lg mb-6">{mensagem}</p>
         {statusPagamento === "erro" && (
            <button
               onClick={() => (window.location.href = "/carrinho")}
               className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition duration-300"
            >
               Voltar para o Carrinho
            </button>
         )}
         {statusPagamento === "sucesso" && (
            <button
               onClick={() => (window.location.href = "/minha-conta")}
               className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
               Ir para Meus Pedidos
            </button>
         )}
      </div>
   );
}
