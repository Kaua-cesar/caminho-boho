// src/utils/carrinho.js

const KEY = "carrinho";

export function getCarrinho() {
   return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function salvarCarrinho(itens) {
   localStorage.setItem(KEY, JSON.stringify(itens));
}

export function adicionarAoCarrinho(produto) {
   if (
      !produto ||
      !produto.id ||
      typeof (produto.preco ?? produto.precoOriginal) !== "number"
   ) {
      console.warn(
         "Produto inválido não será adicionado ao carrinho:",
         produto
      );
      return;
   }

   const carrinho = getCarrinho();
   const itemExistente = carrinho.find((item) => item.id === produto.id);

   if (itemExistente) {
      itemExistente.quantidade += 1;
   } else {
      carrinho.push({
         ...produto,
         preco: produto.preco ?? produto.precoOriginal,
         quantidade: 1,
      });
   }

   salvarCarrinho(carrinho);
   window.dispatchEvent(new Event("carrinhoAtualizado"));
}

export function removerDoCarrinho(id) {
   const carrinho = getCarrinho().filter((item) => item.id !== id);
   salvarCarrinho(carrinho);
   window.dispatchEvent(new Event("carrinhoAtualizado"));
}
