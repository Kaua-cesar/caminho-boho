// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext();

export const useCart = () => {
   return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
   const { user, loading: authLoading } = useAuth();
   const [cartItems, setCartItems] = useState([]);
   const [cartLoading, setCartLoading] = useState(true);

   useEffect(() => {
      const fetchCart = async () => {
         if (authLoading) return;

         if (user) {
            setCartLoading(true);
            try {
               const userCartRef = doc(db, "carts", user.uid);
               const docSnap = await getDoc(userCartRef);
               if (docSnap.exists()) {
                  setCartItems(docSnap.data().items || []);
               } else {
                  await setDoc(userCartRef, { items: [] });
                  setCartItems([]);
               }
            } catch (error) {
               toast.error("Erro ao carregar seu carrinho.");
               setCartItems([]);
            } finally {
               setCartLoading(false);
            }
         } else {
            setCartItems([]);
            setCartLoading(false);
         }
      };

      fetchCart();
   }, [user, authLoading]);

   const addItemToCart = async (product) => {
      if (!user) {
         toast.info(
            "Você precisa estar logado para adicionar itens ao carrinho."
         );
         return false;
      }

      setCartLoading(true);
      try {
         const userCartRef = doc(db, "carts", user.uid);
         const docSnap = await getDoc(userCartRef);
         let updatedItems = [];

         if (docSnap.exists()) {
            const currentItems = docSnap.data().items || [];
            const existingItemIndex = currentItems.findIndex(
               (item) =>
                  item.id === product.id &&
                  item.cor === product.cor &&
                  item.tamanho === product.tamanho
            );

            if (existingItemIndex > -1) {
               updatedItems = currentItems.map((item, index) =>
                  index === existingItemIndex
                     ? {
                          ...item,
                          quantidade: item.quantidade + product.quantidade,
                       }
                     : item
               );
            } else {
               updatedItems = [...currentItems, { ...product }];
            }
         } else {
            updatedItems = [{ ...product }];
         }

         await setDoc(userCartRef, { items: updatedItems });
         setCartItems(updatedItems);
         toast.success(`${product.nome} adicionado ao carrinho!`);
         return true;
      } catch (error) {
         toast.error(`Erro ao adicionar ${product.nome} ao carrinho.`);
         return false;
      } finally {
         setCartLoading(false);
      }
   };

   const removeItemFromCart = async (productId, color, size) => {
      if (!user) {
         toast.info(
            "Você precisa estar logado para remover itens do carrinho."
         );
         return false;
      }

      setCartLoading(true);
      try {
         const userCartRef = doc(db, "carts", user.uid);
         const docSnap = await getDoc(userCartRef);

         if (docSnap.exists()) {
            const currentItems = docSnap.data().items || [];
            let itemFound = false;
            const updatedItems = currentItems.filter((item) => {
               const isMatch =
                  item.id === productId &&
                  item.cor === color &&
                  item.tamanho === size;
               if (isMatch) {
                  itemFound = true;
               }
               return !isMatch;
            });

            if (!itemFound) {
               toast.error("Item não encontrado no seu carrinho para remover.");
               return false;
            }

            await setDoc(userCartRef, { items: updatedItems });
            setCartItems(updatedItems);
            toast.info("Item removido do carrinho.");
            return true;
         } else {
            toast.error("Seu carrinho está vazio ou não foi encontrado.");
            return false;
         }
      } catch (error) {
         toast.error("Erro ao remover item do carrinho.");
         return false;
      } finally {
         setCartLoading(false);
      }
   };

   const updateItemQuantity = async (productId, newQuantity, color, size) => {
      if (!user) {
         toast.info("Você precisa estar logado para atualizar o carrinho.");
         return;
      }

      if (newQuantity < 1) {
         await removeItemFromCart(productId, color, size);
         return;
      }

      setCartLoading(true);
      try {
         const userCartRef = doc(db, "carts", user.uid);
         const docSnap = await getDoc(userCartRef);

         if (docSnap.exists()) {
            const currentItems = docSnap.data().items || [];
            const updatedItems = currentItems.map((item) =>
               item.id === productId &&
               item.cor === color &&
               item.tamanho === size
                  ? { ...item, quantidade: newQuantity }
                  : item
            );
            await setDoc(userCartRef, { items: updatedItems });
            setCartItems(updatedItems);
         }
      } catch (error) {
         toast.error("Erro ao atualizar a quantidade do item.");
      } finally {
         setCartLoading(false);
      }
   };

   const clearCart = async () => {
      if (!user) {
         toast.info("Você precisa estar logado para limpar o carrinho.");
         return;
      }

      setCartLoading(true);
      try {
         const userCartRef = doc(db, "carts", user.uid);
         await setDoc(userCartRef, { items: [] });
         setCartItems([]);
         toast.info("Carrinho limpo!");
      } catch (error) {
         toast.error("Erro ao limpar o carrinho.");
      } finally {
         setCartLoading(false);
      }
   };

   return (
      <CartContext.Provider
         value={{
            cartItems,
            cartLoading,
            addItemToCart,
            removeItemFromCart,
            updateItemQuantity,
            clearCart,
         }}
      >
         {children}
      </CartContext.Provider>
   );
};
