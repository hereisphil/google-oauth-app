import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import Header from "./components/global/Header.tsx";
import { TokenProvider } from "./context/TokenContext.tsx";
import "./styles/index.css";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <TokenProvider>
                <Header />
                <App />
            </TokenProvider>
        </BrowserRouter>
    </StrictMode>,
);
