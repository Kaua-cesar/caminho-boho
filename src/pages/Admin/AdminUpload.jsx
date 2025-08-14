import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { X } from "lucide-react";

const ADMIN_EMAILS = [
   "kauacz04coc@gmail.com",
   "campanariolais@gmail.com",
   "mais.um.email@exemplo.com",
];

const VITE_API_URL = import.meta.env.VITE_API_URL;

const initialProductState = {
   nome: "",
   descricao: "",
   precoOriginal: "",
   desconto: "",
   categoria: "",
   imagem: "",
   cores: {},
   avaliacoes: "",
   quantidadeAvaliacoes: "",
};

export default function AdminUpload() {
   const navigate = useNavigate();
   const [openAdd, setOpenAdd] = useState(false);
   const [openRemove, setOpenRemove] = useState(false);
   const [openEdit, setOpenEdit] = useState(false);

   const [isAdmin, setIsAdmin] = useState(false);
   const [loading, setLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [produtoIdRemover, setProdutoIdRemover] = useState("");
   const [produtoIdEditar, setProdutoIdEditar] = useState("");
   const [produtoParaEditar, setProdutoParaEditar] = useState(null);

   const [produto, setProduto] = useState(initialProductState);
   const [novaCor, setNovaCor] = useState("");

   useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         if (!user || !ADMIN_EMAILS.includes(user.email)) {
            navigate("/");
            return;
         }
         setIsAdmin(true);
         setLoading(false);
      });
      return () => unsubscribe();
   }, [navigate]);

   if (loading) return <div>Carregando...</div>;
   if (!isAdmin) return null;

   const createEstoqueFromCores = (cores) => {
      const estoque = {};
      Object.keys(cores).forEach((cor) => {
         const tamanhosComQuantidade = Object.fromEntries(
            Object.entries(cores[cor]).filter(([_, qtd]) => qtd > 0)
         );
         if (Object.keys(tamanhosComQuantidade).length > 0) {
            estoque[cor] = tamanhosComQuantidade;
         }
      });
      return estoque;
   };

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

   const removerCor = (cor) => {
      const copy = { ...produto.cores };
      delete copy[cor];
      setProduto((prev) => ({ ...prev, cores: copy }));
   };

   const adicionarCorEdicao = () => {
      if (novaCor && produtoParaEditar && !produtoParaEditar.cores[novaCor]) {
         setProdutoParaEditar((prev) => ({
            ...prev,
            cores: {
               ...prev.cores,
               [novaCor]: { PP: 0, P: 0, M: 0, G: 0, GG: 0 },
            },
         }));
         setNovaCor("");
      }
   };

   const removerCorEdicao = (cor) => {
      setProdutoParaEditar((prev) => {
         const copy = { ...prev.cores };
         delete copy[cor];
         return { ...prev, cores: copy };
      });
   };

   const handleTamanhoChange = (cor, tamanho, value, isEditing = false) => {
      const setter = isEditing ? setProdutoParaEditar : setProduto;
      setter((prev) => ({
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

   async function criarProduto() {
      setIsSubmitting(true);
      try {
         const auth = getAuth();
         const user = auth.currentUser;
         if (!user) {
            throw new Error("Usuário não autenticado.");
         }
         const token = await user.getIdToken();

         const newProduct = {
            ...produto,
            precoOriginal: parseFloat(produto.precoOriginal) || 0,
            desconto: parseFloat(produto.desconto) || 0,
            avaliacoes: parseFloat(produto.avaliacoes) || 0,
            quantidadeAvaliacoes: parseInt(produto.quantidadeAvaliacoes) || 0,
            estoque: createEstoqueFromCores(produto.cores),
         };
         delete newProduct.cores;

         const res = await fetch(`${VITE_API_URL}/add-products`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify([newProduct]),
         });

         const data = await res.json();
         if (res.ok) {
            toast.success("Produto adicionado com sucesso!");
            setProduto(initialProductState);
            setOpenAdd(false);
         } else {
            toast.error(data.error || "Erro ao adicionar produto");
         }
      } catch (error) {
         console.error(error);
         toast.error(`Erro ao criar produto: ${error.message}`);
      } finally {
         setIsSubmitting(false);
      }
   }

   async function removerProduto() {
      if (!produtoIdRemover.trim()) {
         toast.error("Digite o ID do produto para remover.");
         return;
      }
      setIsSubmitting(true);
      try {
         const auth = getAuth();
         const user = auth.currentUser;
         const token = await user.getIdToken();

         const res = await fetch(
            `${VITE_API_URL}/delete-product/${produtoIdRemover}`,
            {
               method: "DELETE",
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         const data = await res.json();

         if (res.ok) {
            toast.success(data.message);
            setProdutoIdRemover("");
            setOpenRemove(false);
         } else {
            toast.error(data.error || "Produto não encontrado");
         }
      } catch (err) {
         console.error(err);
         toast.error("Erro ao remover produto");
      } finally {
         setIsSubmitting(false);
      }
   }

   async function buscarProdutoParaEditar() {
      if (!produtoIdEditar.trim()) {
         return toast.error("Digite o ID do produto para editar");
      }
      setIsSubmitting(true);
      try {
         const auth = getAuth();
         const user = auth.currentUser;
         const token = await user.getIdToken();

         const res = await fetch(
            `${VITE_API_URL}/get-product/${produtoIdEditar}`,
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );

         if (!res.ok) {
            const errorData = await res.json();
            toast.error(errorData.error || "Produto não encontrado");
            setProdutoParaEditar(null);
            return;
         }

         const data = await res.json();
         const coresFormatadas = {};
         if (data.product.estoque) {
            Object.keys(data.product.estoque).forEach((cor) => {
               coresFormatadas[cor] = {
                  PP: 0,
                  P: 0,
                  M: 0,
                  G: 0,
                  GG: 0,
                  ...data.product.estoque[cor],
               };
            });
         }
         setProdutoParaEditar({ ...data.product, cores: coresFormatadas });
      } catch (err) {
         console.error(err);
         toast.error("Erro ao buscar produto");
      } finally {
         setIsSubmitting(false);
      }
   }

   async function editarProduto() {
      if (!produtoParaEditar) return;
      setIsSubmitting(true);
      try {
         const auth = getAuth();
         const user = auth.currentUser;
         const token = await user.getIdToken();

         const produtoAtualizado = {
            ...produtoParaEditar,
            precoOriginal: parseFloat(produtoParaEditar.precoOriginal) || 0,
            desconto: parseFloat(produtoParaEditar.desconto) || 0,
            avaliacoes: parseFloat(produtoParaEditar.avaliacoes) || 0,
            quantidadeAvaliacoes:
               parseInt(produtoParaEditar.quantidadeAvaliacoes) || 0,
            estoque: createEstoqueFromCores(produtoParaEditar.cores),
         };
         delete produtoAtualizado.cores;

         // CORRIGIDO: O nome da rota agora está no plural 'update-products'
         const res = await fetch(
            `${VITE_API_URL}/update-products/${produtoIdEditar}`,
            {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(produtoAtualizado),
            }
         );
         const data = await res.json();

         if (res.ok) {
            toast.success("Produto editado com sucesso!");
            setProdutoParaEditar(null);
            setProdutoIdEditar("");
            setOpenEdit(false);
         } else {
            toast.error(data.error || "Erro ao editar produto");
         }
      } catch (err) {
         console.error(err);
         toast.error("Erro ao editar produto");
      } finally {
         setIsSubmitting(false);
      }
   }

   const renderCoresInputs = (
      cores,
      handleTamanhoChangeFn,
      isEditing = false
   ) => {
      return Object.keys(cores).map((cor) => (
         <div key={cor} className="mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-center mb-2">
               <span className="font-semibold">{cor}</span>
               <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                     isEditing ? removerCorEdicao(cor) : removerCor(cor)
                  }
               >
                  <X className="h-4 w-4" />
               </Button>
            </div>
            <div className="flex sm:flex-row gap-2 sm:gap-3 flex-col">
               {["PP", "P", "M", "G", "GG"].map((tamanho) => (
                  <div key={tamanho}>
                     <label className="flex ml-1 text-xs font-medium text-gray-500">
                        {tamanho}
                     </label>
                     <Input
                        type="number"
                        className={"text-center"}
                        min="0"
                        value={cores[cor][tamanho]}
                        onChange={(e) =>
                           handleTamanhoChangeFn(
                              cor,
                              tamanho,
                              e.target.value,
                              isEditing
                           )
                        }
                     />
                  </div>
               ))}
            </div>
         </div>
      ));
   };

   return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 w-full ">
         <Dialog open={openAdd} onOpenChange={setOpenAdd}>
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
                  onSubmit={async (e) => {
                     e.preventDefault();
                     await criarProduto();
                  }}
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
                     placeholder="Avaliações (1-5)"
                     value={produto.avaliacoes}
                     onChange={(e) =>
                        setProduto({ ...produto, avaliacoes: e.target.value })
                     }
                     min={0}
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
                     {renderCoresInputs(produto.cores, handleTamanhoChange)}
                  </div>
                  <DialogFooter className="mt-4">
                     <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Criar Produto"}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         <Dialog
            open={openEdit}
            onOpenChange={(isOpen) => {
               setOpenEdit(isOpen);
               if (!isOpen) {
                  setProdutoIdEditar("");
                  setProdutoParaEditar(null);
               }
            }}
         >
            <DialogTrigger asChild>
               <Button variant="secondary">Editar Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-auto">
               <DialogHeader>
                  <DialogTitle>Editar Produto</DialogTitle>
               </DialogHeader>
               {!produtoParaEditar ? (
                  <div className="space-y-3">
                     <Input
                        placeholder="ID do Produto (ex: produto-1)"
                        value={produtoIdEditar}
                        onChange={(e) => setProdutoIdEditar(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              buscarProdutoParaEditar();
                           }
                        }}
                     />
                     <Button
                        className="w-full"
                        onClick={buscarProdutoParaEditar}
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Buscando..." : "Buscar Produto"}
                     </Button>
                  </div>
               ) : (
                  <form
                     onSubmit={async (e) => {
                        e.preventDefault();
                        await editarProduto();
                     }}
                     className="flex flex-col gap-4"
                  >
                     <Input
                        placeholder="Nome"
                        value={produtoParaEditar.nome}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              nome: e.target.value,
                           })
                        }
                     />
                     <Textarea
                        placeholder="Descrição"
                        value={produtoParaEditar.descricao}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              descricao: e.target.value,
                           })
                        }
                     />
                     <Input
                        placeholder="Preço Original"
                        type="number"
                        value={produtoParaEditar.precoOriginal}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              precoOriginal: e.target.value,
                           })
                        }
                     />
                     <Input
                        placeholder="Desconto (%)"
                        type="number"
                        value={produtoParaEditar.desconto}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              desconto: e.target.value,
                           })
                        }
                        min={0}
                        max={100}
                     />
                     <Input
                        placeholder="Categoria"
                        value={produtoParaEditar.categoria}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              categoria: e.target.value,
                           })
                        }
                     />
                     <Input
                        placeholder="URL da Imagem"
                        value={produtoParaEditar.imagem}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              imagem: e.target.value,
                           })
                        }
                     />
                     <Input
                        type="number"
                        placeholder="Avaliações (1-5)"
                        value={produtoParaEditar.avaliacoes}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              avaliacoes: e.target.value,
                           })
                        }
                        min={0}
                        max={5}
                     />
                     <Input
                        type="number"
                        placeholder="Quantidade de Avaliações"
                        value={produtoParaEditar.quantidadeAvaliacoes}
                        onChange={(e) =>
                           setProdutoParaEditar({
                              ...produtoParaEditar,
                              quantidadeAvaliacoes: e.target.value,
                           })
                        }
                     />
                     <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">
                           Gerenciar Cores e Tamanhos
                        </label>
                        <div className="flex mb-4 flex-col sm:flex-row sm:gap-0 gap-2 ">
                           <Input
                              type="text"
                              placeholder="Nome da cor (ex: Rosa)"
                              value={novaCor}
                              onChange={(e) => setNovaCor(e.target.value)}
                           />
                           <Button
                              type="button"
                              onClick={adicionarCorEdicao}
                              className="ml-2"
                           >
                              Adicionar Cor
                           </Button>
                        </div>
                        {renderCoresInputs(
                           produtoParaEditar.cores,
                           handleTamanhoChange,
                           true
                        )}
                     </div>
                     <DialogFooter>
                        <Button
                           type="submit"
                           className="w-full"
                           disabled={isSubmitting}
                        >
                           {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                     </DialogFooter>
                  </form>
               )}
            </DialogContent>
         </Dialog>
         <Dialog open={openRemove} onOpenChange={setOpenRemove}>
            <DialogTrigger asChild>
               <Button variant="destructive">Remover Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Remover Produto</DialogTitle>
               </DialogHeader>
               <form
                  onSubmit={async (e) => {
                     e.preventDefault();
                     await removerProduto();
                  }}
                  className="space-y-3"
               >
                  <Input
                     placeholder="ID do Produto (ex: produto-1)"
                     value={produtoIdRemover}
                     onChange={(e) => setProdutoIdRemover(e.target.value)}
                  />
                  <DialogFooter>
                     <Button
                        type="submit"
                        variant="destructive"
                        className="w-full"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Removendo..." : "Remover"}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
}
