// src/components/auth/RotaPublica.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RotaPublica({ children }) {
   const { user } = useAuth();
   return user ? <Navigate to="/minha-conta" replace /> : children;
}
