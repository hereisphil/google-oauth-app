import { createContext, useMemo, useState, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                           TS: Types & Interfaces:                          */
/* -------------------------------------------------------------------------- */
type Token = string | null;

interface TokenContextValue {
    token: Token;
    setToken: (newToken: Token) => void;
}

interface TokenProviderProps {
    children: ReactNode;
}

// Function needed to get the Token and use it in the app
// eslint-disable-next-line react-refresh/only-export-components
export const TokenContext = createContext<TokenContextValue | undefined>(
    undefined,
);

// Provider that wraps the entire App to ensure the Token is accessible everywhere
export const TokenProvider = ({ children }: TokenProviderProps) => {
    const [token, setTokenInternal] = useState<Token>(() => {
        return localStorage.getItem("token"); // Using localStorage, may update later
    });

    const setToken = (newToken: Token) => {
        if (!newToken) {
            localStorage.removeItem("token");
            setTokenInternal(null);
            return;
        }

        localStorage.setItem("token", newToken);
        setTokenInternal(newToken);
    };

    const value = useMemo<TokenContextValue>(
        () => ({ token, setToken }),
        [token],
    );

    return (
        <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
    );
};
