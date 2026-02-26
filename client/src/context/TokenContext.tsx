import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                        TypeScript Types & Interfaces                       */
/* -------------------------------------------------------------------------- */

// The token is either a string (when logged in) or null (when logged out)
type Token = string | null;

// The user object returned from the backend after verifying the token
export interface AuthUser {
    _id: string;
    googleId: string;
    email: string;
    name?: string;
    pictureUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    refreshToken?: string;
    accessToken?: string;
    accessTokenExpiresAt?: string;
}

// The context value will include the token, the user, and functions to update the token or refetch user
// This is what components will use when they use the context
type TokenContextValue = {
    token: Token;
    user: AuthUser | null;
    setToken: (newToken: Token) => void;
    /** Refetch user from backend (e.g. after refreshing Google access token) so Picker gets latest accessToken */
    refetchUser: () => Promise<void>;
};

/* -------------------------------------------------------------------------- */
/*                            Begin Writing Context                           */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line react-refresh/only-export-components
export const TokenContext = createContext<TokenContextValue>({
    token: null,
    user: null,
    setToken: () => {},
    refetchUser: async () => {},
});

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<Token>(() => {
        return localStorage.getItem("token");
    });

    const [user, setUser] = useState<AuthUser | null>(null);

    // keep token + localStorage in sync
    const updateToken = (newToken: Token) => {
        if (!newToken) {
            localStorage.removeItem("token");
            setToken(null);
            return;
        }
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    /**
     * Fetches the current user from the backend using the stored JWT.
     * Used on app load and whenever token changes; also call after refreshing
     * the Google access token so the Picker gets the new accessToken.
     */
    const fetchUser = async () => {
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/v1/auth/token`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });

            if (!res.ok) {
                setUser(null);
                localStorage.removeItem("token");
                setToken(null);
                return;
            }

            const data = (await res.json()) as AuthUser;
            setUser(data);
        } catch (err) {
            setUser(null);
            console.error("Error verifying token:", err);
        }
    };

    // Verify token on app load + whenever token changes
    useEffect(() => {
        fetchUser();
    }, [token]);

    /** Refetch user from backend without changing token (e.g. after Google token refresh) */
    const refetchUser = useCallback(async () => {
        if (!token) return;
        await fetchUser();
    }, [token]);

    return (
        <TokenContext.Provider value={{ token, user, setToken: updateToken, refetchUser }}>
            {children}
        </TokenContext.Provider>
    );
};
