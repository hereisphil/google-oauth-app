import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useToken } from "../utils/useToken";

export function LoginPage() {
    const { setToken } = useToken();

    const [googleOauthUrl, setGoogleOauthUrl] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const oauthToken = queryParams.get("token");
    useEffect(() => {
        if (oauthToken) {
            setToken(oauthToken);
            navigate("/user-info", { replace: true });
        }
    }, [oauthToken, setToken, navigate]);

    useEffect(() => {
        const loadOauthUrl = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/v1/auth/google/url",
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
