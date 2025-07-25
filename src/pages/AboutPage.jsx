// src/pages/AboutPage.jsx (ou SobrePage.jsx)
import React from "react";

export function AboutPage() {
   // Ou SobrePage
   return (
      <div className="flex items-center justify-center flex-col mx-46">
         <h1 className="text-3xl font-bold my-8 text-center text-gray-800">
            Sobre a Caminho Boho
         </h1>

         <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
               Bem-vindo à **Caminho Boho**, o seu destino online para moda que
               celebra a liberdade, a natureza e a expressão individual.
               Acreditamos que a roupa é uma forma de arte e uma extensão da sua
               alma, e é por isso que selecionamos peças que contam uma
               história.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
               Nossa jornada começou com a paixão pelo estilo boho, que vai além
               de uma simples tendência. É um estilo de vida que abraça o
               conforto, a fluidez e a conexão com o mundo ao nosso redor. Cada
               item em nossa coleção é escolhido a dedo, priorizando tecidos
               naturais, caimentos leves e estampas que remetem à beleza
               artesanal e à cultura global.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
               Na Caminho Boho, você encontrará desde vestidos esvoaçantes e
               kimonos vibrantes até acessórios únicos que complementam o seu
               look com um toque autêntico. Nosso objetivo é oferecer peças que
               você possa usar para criar seu próprio caminho, sentindo-se
               confiante, bela e em sintonia com a sua essência.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
               Junte-se a nós nesta jornada e descubra a beleza de ser você, com
               a leveza e o encanto que só o estilo boho pode oferecer.
            </p>
         </div>

         <div className="text-sm text-center">
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">
               Nossos Valores
            </h2>
            <ul className="list-disc list-inside text-left text-gray-700 max-w-md mx-auto">
               <li className="mb-2">
                  **Autenticidade:** Celebramos a individualidade e a
                  originalidade em cada peça.
               </li>
               <li className="mb-2">
                  **Conforto:** Acreditamos que a moda deve ser agradável de
                  usar e livre de restrições.
               </li>
               <li className="mb-2">
                  **Conexão:** Buscamos peças que reflitam a harmonia com a
                  natureza e diversas culturas.
               </li>
               <li className="mb-2">
                  **Qualidade:** Comprometimento em oferecer produtos duráveis e
                  de excelente acabamento.
               </li>
               <li className="mb-2">
                  **Inspiração:** Queremos inspirar nossos clientes a se
                  expressarem livremente através do estilo.
               </li>
            </ul>
         </div>
      </div>
   );
}
