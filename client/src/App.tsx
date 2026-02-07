import { useEffect, useState } from "react";

function App() {
    const [googleOauthUrl, setGoogleOauthUrl] = useState("");

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

export default App;
