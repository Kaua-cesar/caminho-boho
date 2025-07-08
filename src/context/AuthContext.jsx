import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
   // Tenta recuperar usuário do localStorage para persistência simples
   const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
   });

   // Sincroniza user no localStorage para manter login
   useEffect(() => {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
   }, [user]);

   // Simula login (troque para sua lógica/fetch de API/Firebase)
   function login(email, password) {
      // Aqui vc pode validar email e senha, chamar API etc.
      // Vou simular sucesso direto:
      setUser({ email });
   }

   function logout() {
      setUser(null);
   }

   return (
      <AuthContext.Provider value={{ user, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
