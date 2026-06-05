import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/schibsted-grotesk/700.css";
import "@fontsource/schibsted-grotesk/900.css";
import "@fontsource-variable/familjen-grotesk/wght.css";
import "@fontsource-variable/martian-mono/wght.css";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
