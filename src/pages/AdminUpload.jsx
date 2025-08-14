import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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

const ADMIN_EMAILS = [
   "kauacz04coc@gmail.com",
   "campanariolais@gmail.com",
   "mais.um.email@exemplo.com",
];

export default function AdminUpload() {
   const navigate = useNavigate();
   const [open, setOpen] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);
   const [loading, setLoading] = useState(true);
   const [produto, setProduto] = useState({
      nome: "",
      descricao: "",
      precoOriginal: "",
      desconto: "",
      categoria: "",
      imagem: "",
      cores: {},
      avaliacoes: "",
      quantidadeAvaliacoes: "",
   });
   const [novaCor, setNovaCor] = useState("");

   useEffect(() => {
      const auth = getAuth();

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (!user) {
            navigate("/"); // não logado
            return;
         }

         // Verifica se o email do usuário está na lista de admins
         if (!ADMIN_EMAILS.includes(user.email)) {
            navigate("/"); // não é admin
            return;
         }

         setIsAdmin(true);
         setLoading(false);
      });

      return () => unsubscribe();
   }, [navigate]);

   if (loading) return <div>Carregando...</div>;
   if (!isAdmin) return null;

   async function criarProduto(e) {
      e.preventDefault();
      try {
         const auth = getAuth();
         const user = auth.currentUser;
         if (!user) return alert("Você precisa estar logado!");

         const token = await user.getIdToken();

         const estoque = {};
         Object.keys(produto.cores).forEach((cor) => {
            const tamanhosComQuantidade = Object.fromEntries(
               Object.entries(produto.cores[cor]).filter(([_, qtd]) => qtd > 0)
            );
            if (Object.keys(tamanhosComQuantidade).length > 0) {
               estoque[cor] = tamanhosComQuantidade;
            }
         });

         const newProduct = {
            ...produto,
            precoOriginal: parseFloat(produto.precoOriginal) || 0,
            desconto: parseFloat(produto.desconto) || 0,
            avaliacoes: parseFloat(produto.avaliacoes) || 0,
            quantidadeAvaliacoes: parseInt(produto.quantidadeAvaliacoes) || 0,
            estoque,
            cores: undefined,
            imagem: produto.imagem,
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
            setProduto({
               nome: "",
               descricao: "",
               precoOriginal: "",
               desconto: "",
               categoria: "",
               imagem: "",
               cores: {},
               avaliacoes: "",
               quantidadeAvaliacoes: "",
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
                     onChange={(e) => {
                        let val = parseFloat(e.target.value) || 0;
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setProduto({ ...produto, desconto: val });
                     }}
                     min={0}
                     max={100}
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
                  <Input
                     type="number"
                     placeholder="Avaliações"
                     value={produto.avaliacoes}
                     onChange={(e) => {
                        let val = parseInt(e.target.value) || 0;
                        if (val > 5) val = 5;
                        setProduto({ ...produto, avaliacoes: val });
                     }}
                     max={5}
                  />
                  <Input
                     type="number"
                     placeholder="Quantidade de Avaliações"
                     value={produto.quantidadeAvaliacoes}
                     onChange={(e) =>
                        setProduto({
                           ...produto,
                           quantidadeAvaliacoes: e.target.value,
                        })
                     }
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
