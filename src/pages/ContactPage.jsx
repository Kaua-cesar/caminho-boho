// src/pages/ContactPage.jsx (ou ContatoPage.jsx)
import React, { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: "",
   });
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      if (
         !formData.name ||
         !formData.email ||
         !formData.subject ||
         !formData.message
      ) {
         toast.error("Por favor, preencha todos os campos do formulário.");
         setIsSubmitting(false);
         return;
      }

      try {
         const response = await fetch(
            `${import.meta.env.VITE_API_URL}/send-contact`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(formData),
            }
         );

         const data = await response.json();

         if (data.success) {
            toast.success(
               "Sua mensagem foi enviada com sucesso! Em breve entraremos em contato."
            );
            setFormData({
               name: "",
               email: "",
               subject: "",
               message: "",
            });
         } else {
            toast.error(
               data.message ||
                  "Erro ao enviar mensagem. Tente novamente mais tarde."
            );
         }
      } catch (error) {
         console.error("Erro ao enviar formulário:", error);
         toast.error(
            "Ocorreu um erro de conexão. Verifique se o servidor está rodando."
         );
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="pt-[4.25rem] px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
         <h1 className="text-3xl sm:text-4xl font-bold my-8 text-center text-gray-800">
            Fale Conosco
         </h1>

         <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8 w-full max-w-4xl">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 text-center">
               Tem alguma dúvida, sugestão ou precisa de suporte? Entre em
               contato conosco através do formulário abaixo ou pelos nossos
               canais de atendimento.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
               <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-amber-600 text-center md:text-left">
                     Nossos Contatos
                  </h2>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base text-center md:text-left">
                     <strong>E-mail:</strong>{" "}
                     <a
                        href="mailto:contato@caminhoboho.com.br"
                        className="text-blue-600 hover:underline"
                     >
                        contato@caminhoboho.com.br
                     </a>
                  </p>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base text-center md:text-left">
                     <strong>Telefone:</strong>{" "}
                     <a
                        href="https://wa.me/5521959227889"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                     >
                        (21) 95922-7889
                     </a>
                  </p>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base text-center md:text-left">
                     <strong>Horário de Atendimento:</strong> Segunda a Sexta,
                     das 9h às 18h.
                  </p>
               </div>

               <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-amber-600 text-center md:text-left">
                     Envie uma Mensagem
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label
                           htmlFor="name"
                           className="block text-gray-700 text-sm font-bold mb-2"
                        >
                           Nome Completo
                        </label>
                        <input
                           type="text"
                           id="name"
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           required
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="email"
                           className="block text-gray-700 text-sm font-bold mb-2"
                        >
                           E-mail
                        </label>
                        <input
                           type="email"
                           id="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           required
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="subject"
                           className="block text-gray-700 text-sm font-bold mb-2 "
                        >
                           Assunto
                        </label>
                        <input
                           type="text"
                           id="subject"
                           name="subject"
                           value={formData.subject}
                           onChange={handleChange}
                           className="font-semibold shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           required
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="message"
                           className="block text-gray-700 text-sm font-bold mb-2"
                        >
                           Mensagem
                        </label>
                        <textarea
                           id="message"
                           name="message"
                           value={formData.message}
                           onChange={handleChange}
                           rows="5"
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           required
                        ></textarea>
                     </div>
                     <button
                        type="submit"
                        className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 w-full"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}
