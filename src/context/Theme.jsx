// hooks/useTheme.js
import { useEffect, useState } from "react";

export function useTheme() {
   const [theme, setTheme] = useState("dark");

   useEffect(() => {
      document.body.setAttribute("data-theme", theme);
   }, [theme]);

   return { theme, setTheme };
}
