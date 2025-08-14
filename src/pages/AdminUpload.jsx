import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminUpload() {
   const [open, setOpen] = useState(false);
   const [produto, setProduto] = useState({
      nome: "",
      descricao: "",
      precoOriginal: "",
      desconto: 0,
      categoria: "",
      imagem: "",
      cores: {}, // Objeto para armazenar cores e seus tamanhos
   });
   const [novaCor, setNovaCor] = useState("");

   async function criarProduto(e) {
      e.preventDefault();
      try {
         const auth = getAuth();
         const user = auth.currentUser;
         if (!user) return alert("Você precisa estar logado!");

         const token = await user.getIdToken();

         // Mapeia o objeto `cores` para a nova estrutura de `estoque`
         const estoque = {};
         Object.keys(produto.cores).forEach((cor) => {
            const tamanhosComQuantidade = Object.fromEntries(
               Object.entries(produto.cores[cor]).filter(([_, qtd]) => qtd > 0)
            );
            // Adiciona a cor apenas se ela tiver tamanhos com quantidade > 0
            if (Object.keys(tamanhosComQuantidade).length > 0) {
               estoque[cor] = tamanhosComQuantidade;
            }
         });

         const newProduct = {
            id: crypto.randomUUID(),
            ...produto,
            precoOriginal: parseFloat(produto.precoOriginal) || 0,
            desconto: parseFloat(produto.desconto) || 0,
            avaliacoes: 0,
            quantidadeAvaliacoes: 0,
            estoque: estoque, // Envia o novo objeto `estoque` para o back-end
            cores: undefined, // Remove a propriedade `cores` original
         };

         const res = await fetch(`${API_URL}/admin-upload`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify([newProduct]),
         });

         const data = await res.json();
         if (res.ok) {
            alert("Produto criado com sucesso!");
            // Reseta o formulário
            setProduto({
               nome: "",
               descricao: "",
               precoOriginal: "",
               desconto: 0,
               categoria: "",
               imagem: "",
               cores: {},
            });
            setNovaCor("");
            setOpen(false);
         } else {
            alert(data.error);
         }
      } catch (err) {
         console.error("Erro ao criar produto:", err);
         alert("Erro ao criar produto");
      }
   }

   // ... restante do código (adicionarCor, handleTamanhoChange, removerCor, renderização)
   // Essas funções permanecem as mesmas

   const adicionarCor = () => {
      if (novaCor && !produto.cores[novaCor]) {
         setProduto((prev) => ({
            ...prev,
            cores: {
               ...prev.cores,
               [novaCor]: { PP: 0, P: 0, M: 0, G: 0, GG: 0 },
            },
         }));
         setNovaCor("");
      }
   };

   const handleTamanhoChange = (cor, tamanho, value) => {
      setProduto((prev) => ({
         ...prev,
         cores: {
            ...prev.cores,
            [cor]: {
               ...prev.cores[cor],
               [tamanho]: parseInt(value) || 0,
            },
         },
      }));
   };

   const removerCor = (cor) => {
      const copy = { ...produto.cores };
      delete copy[cor];
      setProduto((prev) => ({ ...prev, cores: copy }));
   };

   return (
      <div className="h-screen flex items-center justify-center">
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button>Adicionar Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
               <DialogHeader>
                  <DialogTitle>Criar Novo Produto</DialogTitle>
                  <DialogDescription>
                     Preencha os dados abaixo para adicionar um novo produto.
                  </DialogDescription>
               </DialogHeader>
               <form
                  onSubmit={criarProduto}
                  className="flex flex-col gap-4 mt-4"
               >
                  <Input
                     placeholder="Nome"
                     value={produto.nome}
                     onChange={(e) =>
                        setProduto({ ...produto, nome: e.target.value })
                     }
                     required
                  />
                  <Textarea
                     placeholder="Descrição"
                     value={produto.descricao}
                     onChange={(e) =>
                        setProduto({ ...produto, descricao: e.target.value })
                     }
                     required
                  />
                  <Input
                     type="number"
                     placeholder="Preço Original"
                     value={produto.precoOriginal}
                     onChange={(e) =>
                        setProduto({
                           ...produto,
                           precoOriginal: e.target.value,
                        })
                     }
                     required
                  />
                  <Input
                     type="number"
                     placeholder="Desconto (%)"
                     value={produto.desconto}
                     onChange={(e) =>
                        setProduto({ ...produto, desconto: e.target.value })
                     }
                  />
                  <Input
                     placeholder="Categoria"
                     value={produto.categoria}
                     onChange={(e) =>
                        setProduto({ ...produto, categoria: e.target.value })
                     }
                     required
                  />
                  <Input
                     placeholder="URL da Imagem"
                     value={produto.imagem}
                     onChange={(e) =>
                        setProduto({ ...produto, imagem: e.target.value })
                     }
                     required
                  />

                  <div className="mt-4">
                     <label className="block text-sm font-bold mb-2">
                        Gerenciar Cores e Tamanhos
                     </label>
                     <div className="flex mb-2">
                        <Input
                           type="text"
                           placeholder="Nome da cor (ex: Rosa)"
                           value={novaCor}
                           onChange={(e) => setNovaCor(e.target.value)}
                        />
                        <Button
                           type="button"
                           onClick={adicionarCor}
                           className="ml-2"
                        >
                           Adicionar Cor
                        </Button>
                     </div>

                     {Object.keys(produto.cores).map((cor) => (
                        <div key={cor} className="mb-4 p-4 border rounded-md">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">{cor}</span>
                              <Button
                                 type="button"
                                 variant="destructive"
                                 size="sm"
                                 onClick={() => removerCor(cor)}
                              >
                                 Remover
                              </Button>
                           </div>
                           <div className="grid grid-cols-5 gap-2">
                              {["PP", "P", "M", "G", "GG"].map((tamanho) => (
                                 <div key={tamanho}>
                                    <label className="block text-xs font-medium text-gray-500">
                                       {tamanho}
                                    </label>
                                    <Input
                                       type="number"
                                       min="0"
                                       value={produto.cores[cor][tamanho]}
                                       onChange={(e) =>
                                          handleTamanhoChange(
                                             cor,
                                             tamanho,
                                             e.target.value
                                          )
                                       }
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                     >
                        Cancelar
                     </Button>
                     <Button type="submit">Criar Produto</Button>
                  </div>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
}
