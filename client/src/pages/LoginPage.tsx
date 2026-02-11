import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useToken } from "../utils/useToken";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export function LoginPage() {
    const { setToken, user } = useToken();
    const [googleOauthUrl, setGoogleOauthUrl] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    // If already logged in, go to /user-info
    useEffect(() => {
        if (user) navigate("/user-info", { replace: true });
    }, [user, navigate]);

    // Handle token coming back from backend redirect (?token=...)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const oauthToken = queryParams.get("token");
        if (!oauthToken) return;
        setToken(oauthToken);
        navigate("/user-info", { replace: true });
    }, [location.search, setToken, navigate]);

    // Load Google OAuth URL from backend
    useEffect(() => {
        const loadOauthUrl = async () => {
            try {
                const response = await fetch(
                    `${API_BASE}/api/v1/auth/google/url`,
                );
                const data = await response.json();
                const { url } = data;
                setGoogleOauthUrl(url);
            } catch (error) {
                console.log(error);
            }
        };

        loadOauthUrl();
    }, []);

    return (
        <main>
            <h1>Log In</h1>
            <hr />
            <button
                disabled={!googleOauthUrl}
                onClick={() => {
                    window.location.href = googleOauthUrl;
                }}
            >
                Log in with Google
            </button>
        </main>
    );
}
