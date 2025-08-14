import { db } from "./firebase"; // seu arquivo de configuração do Firebase
import { collection, getDocs } from "firebase/firestore";

export async function getProdutos() {
   try {
      const produtosCol = collection(db, "produtos");
      const produtosSnapshot = await getDocs(produtosCol);
      const produtosList = produtosSnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
      }));
      return produtosList;
   } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      return [];
   }
}
