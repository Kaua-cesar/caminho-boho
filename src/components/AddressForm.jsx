// components/AddressForm.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Agora, o componente aceita uma prop opcional `enderecoParaEditar`
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
      ...enderecoParaEditar, // Usa o operador spread para preencher os campos se a prop existir
   });
   const [error, setError] = useState(null);

   // Use useEffect para atualizar o estado interno se a prop `enderecoParaEditar` mudar.
   // Isso é importante para que o formulário seja redefinido corretamente ao iniciar a edição de um novo endereço.
   useEffect(() => {
      if (enderecoParaEditar) {
         setNovoEndereco(enderecoParaEditar);
      } else {
         // Limpa o formulário quando não há endereço para editar (modo de adição)
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
         name === "uf"
      ) {
         formattedValue = value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "");
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
         !novoEndereco.sobrenome ||
         !novoEndereco.nome ||
         !novoEndereco.rua ||
         !novoEndereco.cidade ||
         !novoEndereco.uf ||
         !novoEndereco.cep
      ) {
         setError("Por favor, preencha todos os campos.");
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
      } catch (err) {
         setError(err.message);
      }
   };

   return (
      <div className="flex flex-col gap-2">
         <div className="flex gap-2">
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
         <input
            type="text"
            name="rua"
            value={novoEndereco.rua}
            onChange={handleChange}
            placeholder="Rua, número e bairro"
            className="border rounded px-2 py-1"
         />{" "}
         <input
            type="text"
            name="nome"
            value={novoEndereco.nome}
            onChange={handleChange}
            placeholder="Nome do endereço (Ex: Casa, Trabalho)"
            className="border rounded px-2 py-1"
         />
         <div className="flex gap-2">
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
               className="border rounded px-2 py-1 w-16 uppercase"
               maxLength={2}
            />
            <input
               type="text"
               name="cep"
               value={novoEndereco.cep}
               onChange={handleChange}
               placeholder="CEP"
               className="border rounded px-2 py-1 w-28"
               maxLength={9}
            />
         </div>
         {error && <p className="text-red-600">{error}</p>}
         <Button
            onClick={salvarEndereco}
            className="bg-amber-600 text-white hover:bg-amber-700 mt-2 cursor-pointer"
         >
            {enderecoParaEditar ? "Salvar Alterações" : "Adicionar Endereço"}
         </Button>
      </div>
   );
}
