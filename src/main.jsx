import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Home } from "./Home";
import { Nav } from "./Nav";
import { Carrosel } from "./Carrosel";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <div className="fixed top-0 left-0 w-full z-50">
         <Nav />
      </div>
      <div className="mt-17">
         <Carrosel />
      </div>
      <div className="mx-70">
         <Home />
      </div>
   </StrictMode>
);
