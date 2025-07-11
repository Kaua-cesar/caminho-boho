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

   // Verifica item pelo trio: id + cor + tamanho
   const itemExistente = carrinho.find(
      (item) =>
         item.id === produto.id &&
         item.cor === produto.cor &&
         item.tamanho === produto.tamanho
   );

   if (itemExistente) {
      itemExistente.quantidade += produto.quantidade || 1;
   } else {
      carrinho.push({
         ...produto,
         preco: produto.preco ?? produto.precoOriginal,
         quantidade: produto.quantidade || 1,
      });
   }

   salvarCarrinho(carrinho);
   window.dispatchEvent(new Event("carrinhoAtualizado"));
}

export function removerDoCarrinho(itemParaRemover) {
   const carrinho = getCarrinho().filter(
      (item) =>
         !(
            item.id === itemParaRemover.id &&
            item.cor === itemParaRemover.cor &&
            item.tamanho === itemParaRemover.tamanho
         )
   );
   salvarCarrinho(carrinho);
   window.dispatchEvent(new Event("carrinhoAtualizado"));
}
