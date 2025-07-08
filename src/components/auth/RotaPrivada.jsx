import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RotaPrivada({ children }) {
   const { user } = useAuth();
   return user ? children : <Navigate to="/login" />;
}
