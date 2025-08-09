// components/AddressForm.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AddressForm({
   onAddressAdded,
   onClose,
   userId,
   enderecoParaEditar = null,
}) {
   const [novoEndereco, setNovoEndereco] = useState({
      nomeCompleto: "",
      sobrenome: "",
      nome: "",
      rua: "",
      cidade: "",
      uf: "",
      cep: "",
      ...enderecoParaEditar,
   });
   const [error, setError] = useState(null);

   useEffect(() => {
      if (enderecoParaEditar) {
         setNovoEndereco(enderecoParaEditar);
      } else {
         setNovoEndereco({
            nomeCompleto: "",
            sobrenome: "",
            nome: "",
            rua: "",
            cidade: "",
            uf: "",
            cep: "",
         });
      }
   }, [enderecoParaEditar]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      let formattedValue = value;

      if (
         name === "nomeCompleto" ||
         name === "sobrenome" ||
         name === "cidade" ||
         name === "nome"
      ) {
         formattedValue = value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "");
      }

      if (name === "uf") {
         formattedValue = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
         if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2);
         }
      }

      if (name === "cep") {
         const cleanedValue = value.replace(/\D/g, "");
         if (cleanedValue.length <= 5) {
            formattedValue = cleanedValue;
         } else {
            formattedValue = `${cleanedValue.slice(0, 5)}-${cleanedValue.slice(
               5,
               8
            )}`;
         }
         if (formattedValue.length > 9) {
            formattedValue = formattedValue.slice(0, 9);
         }
      }

      setNovoEndereco((prev) => ({ ...prev, [name]: formattedValue }));
   };

   const salvarEndereco = async () => {
      if (
         !novoEndereco.nomeCompleto ||
         !novoEndereco.nome ||
         !novoEndereco.rua ||
         !novoEndereco.cidade ||
         !novoEndereco.uf ||
         !novoEndereco.cep
      ) {
         setError("Por favor, preencha todos os campos.");
         toast.error("Por favor, preencha todos os campos.");
         return;
      }

      const cleanedCep = novoEndereco.cep.replace(/\D/g, "");
      if (cleanedCep.length !== 8) {
         setError("Por favor, digite um CEP válido com 8 dígitos.");
         toast.error("Por favor, digite um CEP válido com 8 dígitos.");
         return;
      }

      if (novoEndereco.uf.length !== 2) {
         setError("Por favor, digite um UF válido com 2 letras.");
         toast.error("Por favor, digite um UF válido com 2 letras.");
         return;
      }

      setError(null);

      const method = enderecoParaEditar ? "PUT" : "POST";
      const url = enderecoParaEditar
         ? `http://localhost:3001/api/enderecos/${enderecoParaEditar.id}`
         : `http://localhost:3001/api/enderecos`;

      try {
         const response = await fetch(url, {
            method: method,
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...novoEndereco, userId: userId }),
         });

         if (!response.ok) {
            throw new Error("Erro ao salvar endereço");
         }

         onAddressAdded();
         onClose();
         toast.success(
            `Endereço ${
               enderecoParaEditar ? "alterado" : "adicionado"
            } com sucesso!`
         );
      } catch (err) {
         setError(err.message);
         toast.error(err.message);
      }
   };

   return (
      <div className="flex flex-col gap-2">
         {/* Campos de Nome e Sobrenome - Alterado para flex-col em telas pequenas */}
         <div className="flex flex-col sm:flex-row gap-2">
            <input
               type="text"
               name="nomeCompleto"
               value={novoEndereco.nomeCompleto}
               onChange={handleChange}
               placeholder="Nome (Ex: João)"
               className="border rounded px-2 py-1 flex-1"
               required
            />
            <input
               type="text"
               name="sobrenome"
               value={novoEndereco.sobrenome}
               onChange={handleChange}
               placeholder="Sobrenome (Ex: Silva)"
               className="border rounded px-2 py-1 flex-1"
               required
            />
         </div>
         {/* ...outros campos que já estão em colunas, então não precisam de alteração... */}
         <input
            type="text"
            name="rua"
            value={novoEndereco.rua}
            onChange={handleChange}
            placeholder="Rua, número e bairro"
            className="border rounded px-2 py-1"
         />
         <input
            type="text"
            name="nome"
            value={novoEndereco.nome}
            onChange={handleChange}
            placeholder="Nome do endereço (Ex: Casa, Trabalho)"
            className="border rounded px-2 py-1"
         />

         {/* Campos de Cidade, UF e CEP - Alterado para flex-col em telas pequenas */}
         <div className="flex flex-col sm:flex-row gap-2">
            <input
               type="text"
               name="cidade"
               value={novoEndereco.cidade}
               onChange={handleChange}
               placeholder="Cidade"
               className="border rounded px-2 py-1 flex-1"
            />
            <input
               type="text"
               name="uf"
               value={novoEndereco.uf}
               onChange={handleChange}
               placeholder="UF"
               className="border rounded px-2 py-1 sm:w-16 uppercase"
               maxLength={2}
            />
            <input
               type="text"
               name="cep"
               value={novoEndereco.cep}
               onChange={handleChange}
               placeholder="CEP"
               className="border rounded px-2 py-1 sm:w-28"
               maxLength={9}
            />
         </div>
         {error && <p className="text-red-600 text-sm">{error}</p>}
         <Button
            onClick={salvarEndereco}
            className="bg-amber-600 text-white hover:bg-amber-700 mt-2 cursor-pointer"
         >
            {enderecoParaEditar ? "Salvar Alterações" : "Adicionar Endereço"}
         </Button>
      </div>
   );
}
