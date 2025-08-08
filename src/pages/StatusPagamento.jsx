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
      const pedidoId = searchParams.get("pedidoId");
      const payment_id = searchParams.get("payment_id"); // Opcional, mas útil

      if (status === "approved" && pedidoId && !pedidoFinalizado) {
         // Se o pagamento foi aprovado e o pedido ainda não foi finalizado...
         async function finalizarPedido() {
            try {
               // ⭐ Passo 1: Chama a nova rota do seu back-end para atualizar o status do pedido ⭐
               const response = await fetch(
                  `${
                     import.meta.env.VITE_API_URL
                  }/api/pedidos/atualizar-status`,
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        pedidoId: pedidoId,
                        status: "aprovado",
                        paymentId: payment_id,
                     }),
                  }
               );

               if (!response.ok) {
                  throw new Error("Erro ao finalizar o pedido no servidor.");
               }

               // ⭐ Passo 2: Limpa o carrinho e o estado do frete se a atualização for bem-sucedida ⭐
               clearCart();
               setStatusPagamento("sucesso");
               setPedidoFinalizado(true); // Impede que a lógica rode mais de uma vez
               toast.success("Pagamento aprovado e pedido finalizado!");
            } catch (error) {
               console.error("Erro ao finalizar pedido:", error);
               setStatusPagamento("erro");
               toast.error(
                  "Erro ao processar o pedido. Entre em contato com o suporte."
               );
            }
         }
         finalizarPedido();
      } else if (status === "pending") {
         setStatusPagamento("pendente");
      } else if (status === "failure") {
         setStatusPagamento("erro");
      } else {
         // Se o status for nulo ou desconhecido, ainda está processando
         // Ou se a página for acessada sem os parâmetros corretos
         if (!pedidoFinalizado) {
            setStatusPagamento("processando");
         }
      }
   }, [searchParams, clearCart, pedidoFinalizado, cartItems]);

   const getMensagemStatus = () => {
      switch (statusPagamento) {
         case "sucesso":
            return {
               titulo: "Pagamento Aprovado! 🎉",
               mensagem:
                  "Seu pedido foi recebido com sucesso e será processado em breve. Em poucos instantes você receberá um e-mail de confirmação.",
               icone: "✅",
            };
         case "pendente":
            return {
               titulo: "Pagamento Pendente",
               mensagem:
                  "Estamos aguardando a confirmação do seu pagamento. Verifique seu e-mail para mais detalhes.",
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
               onClick={() => (window.location.href = "/")}
               className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
               Voltar para a Página Inicial
            </button>
         )}
      </div>
   );
}
