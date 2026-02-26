import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import Footer from "./components/global/Footer.tsx";
import Header from "./components/global/Header.tsx";
import { TokenProvider } from "./context/TokenContext.tsx";
import { Toaster } from "./components/ui/sonner";
import "./styles/index.css";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <TokenProvider>
                <Header />
                <App />
                <Footer />
                <Toaster />
            </TokenProvider>
        </BrowserRouter>
    </StrictMode>,
);
