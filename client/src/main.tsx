import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { TokenProvider } from "./context/TokenContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <TokenProvider>
                <App />
            </TokenProvider>
        </BrowserRouter>
    </StrictMode>,
);
