// components/AddressForm.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function AddressForm({
   onAddressAdded,
   onClose,
   userId,
   enderecoParaEditar = null,
}) {
   const [novoEndereco, setNovoEndereco] = useState(
      enderecoParaEditar || {
         nomeCompleto: "",
         sobrenome: "",
         localizacao: "",
         celular: "",
         bairro: "",
         numero: "",
         complemento: "",
         rua: "",
         cidade: "",
         uf: "",
         cep: "",
      }
   );
   const [error, setError] = useState(null);

   useEffect(() => {
      if (!enderecoParaEditar) {
         setNovoEndereco({
            nomeCompleto: "",
            sobrenome: "",
            localizacao: "",
            celular: "",
            bairro: "",
            numero: "",
            complemento: "",
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

      if (name === "cep") {
         const cleanedValue = value.replace(/\D/g, "");
         formattedValue = cleanedValue;
         if (cleanedValue.length > 5) {
            formattedValue = `${cleanedValue.slice(0, 5)}-${cleanedValue.slice(
               5,
               8
            )}`;
         }
      } else if (name === "uf") {
         formattedValue = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
         if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2);
         }
      } else if (name === "celular") {
         const cleanedValue = value.replace(/\D/g, "");
         const limit = 11;
         const limitedValue = cleanedValue.slice(0, limit);

         if (limitedValue.length <= 2) {
            formattedValue = limitedValue;
         } else if (limitedValue.length <= 7) {
            formattedValue = `(${limitedValue.slice(
               0,
               2
            )}) ${limitedValue.slice(2)}`;
         } else {
            formattedValue = `(${limitedValue.slice(
               0,
               2
            )}) ${limitedValue.slice(
               2,
               limitedValue.length - 4
            )}-${limitedValue.slice(limitedValue.length - 4)}`;
         }
      } else if (name === "numero") {
         formattedValue = value.replace(/\D/g, "");
      }

      setNovoEndereco((prev) => ({ ...prev, [name]: formattedValue }));
   };

   const salvarEndereco = async () => {
      // 'numero' e 'complemento' foram removidos da lista de campos obrigatórios
      const camposObrigatorios = [
         "nomeCompleto",
         "sobrenome",
         "celular",
         "localizacao",
         "bairro",
         "rua",
         "cidade",
         "uf",
         "cep",
      ];

      for (const campo of camposObrigatorios) {
         if (!novoEndereco[campo]) {
            const msg = "Por favor, preencha todos os campos.";
            setError(msg);
            toast.error(msg);
            return;
         }
      }

      const cleanedCep = novoEndereco.cep.replace(/\D/g, "");
      if (cleanedCep.length !== 8) {
         const msg = "Por favor, digite um CEP válido com 8 dígitos.";
         setError(msg);
         toast.error(msg);
         return;
      }

      if (novoEndereco.uf.length !== 2) {
         const msg = "Por favor, digite um UF válido com 2 letras.";
         setError(msg);
         toast.error(msg);
         return;
      }

      const cleanedCelular = novoEndereco.celular.replace(/\D/g, "");
      if (cleanedCelular.length < 10 || cleanedCelular.length > 11) {
         const msg =
            "Por favor, digite um número de celular válido com 10 ou 11 dígitos (incluindo o DDD).";
         setError(msg);
         toast.error(msg);
         return;
      }

      const enderecoParaSalvar = {
         ...novoEndereco,
         // Se o campo 'numero' estiver vazio, defina-o como 'S/N'
         numero: novoEndereco.numero || "S/N",
         // Se o campo 'complemento' estiver vazio, envie uma string vazia
         complemento: novoEndereco.complemento || "",
      };

      setError(null);

      const method = enderecoParaEditar ? "PUT" : "POST";
      const url = enderecoParaEditar
         ? `${import.meta.env.VITE_API_URL}/api/enderecos/${
              enderecoParaEditar.id
           }`
         : `${import.meta.env.VITE_API_URL}/api/enderecos`;

      try {
         const response = await fetch(url, {
            method: method,
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...enderecoParaSalvar, userId: userId }),
         });

         if (!response.ok) {
            throw new Error("Erro ao salvar endereço.");
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
         Contato
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
         <input
            type="text"
            name="celular"
            value={novoEndereco.celular}
            onChange={handleChange}
            placeholder="Número de telefone"
            className="border rounded px-2 py-1"
            maxLength={15}
         />
         <Separator className={"my-2"} /> Endereco
         <div className="flex flex-col sm:flex-row gap-2">
            <input
               type="text"
               name="cidade"
               value={novoEndereco.cidade}
               onChange={handleChange}
               placeholder="Cidade"
               className="border rounded px-2 py-1 flex-1"
               required
            />
            <input
               type="text"
               name="uf"
               value={novoEndereco.uf}
               onChange={handleChange}
               placeholder="UF"
               className="border rounded px-2 py-1 sm:w-16 uppercase"
               maxLength={2}
               required
            />
            <input
               type="text"
               name="cep"
               value={novoEndereco.cep}
               onChange={handleChange}
               placeholder="CEP"
               className="border rounded px-2 py-1 sm:w-28"
               maxLength={9}
               required
            />
         </div>
         <input
            type="text"
            name="bairro"
            value={novoEndereco.bairro}
            onChange={handleChange}
            placeholder="Bairro"
            className="border rounded px-2 w-full py-1"
            required
         />
         <div className="flex gap-2">
            <input
               type="text"
               name="rua"
               value={novoEndereco.rua}
               onChange={handleChange}
               placeholder="Nome da rua"
               className="border rounded px-2 w-full py-1"
               required
            />
            <input
               type="text"
               name="numero"
               value={novoEndereco.numero}
               onChange={handleChange}
               placeholder="Nº "
               className="border rounded px-2 py-1 w-14"
               maxLength={5}
            />
         </div>
         <input
            type="text"
            name="complemento"
            value={novoEndereco.complemento}
            onChange={handleChange}
            placeholder="Complemento/Referências Prox. (opcional)"
            className="border rounded px-2 py-1"
         />
         <Separator className={"my-2"} />
         <div>
            <label className="text-gray-600">Tipo de endereço:</label>
            <div className="flex gap-2 mt-1">
               {["Casa", "Trabalho"].map((opcao) => (
                  <div key={opcao} className="relative flex-1">
                     <input
                        type="radio"
                        id={`localizacao-${opcao}`}
                        name="localizacao"
                        value={opcao}
                        checked={novoEndereco.localizacao === opcao}
                        onChange={handleChange}
                        className="peer sr-only"
                        required
                     />
                     <label
                        htmlFor={`localizacao-${opcao}`}
                        className="flex items-center justify-center py-2 text-xs font-medium border rounded-md cursor-pointer transition-colors duration-200 ease-in-out border-gray-300 bg-white hover:bg-gray-100 peer-checked:border-amber-600 peer-checked:bg-amber-50 peer-checked:text-amber-600"
                     >
                        {opcao}
                     </label>
                  </div>
               ))}
            </div>
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
