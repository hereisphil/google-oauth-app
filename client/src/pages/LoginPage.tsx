import illustration from "@/assets/images/login-crm-image.png";
// Image from https://pixabay.com/users/be_onligne-23948035 by Chaki Cheri
// Layout inspired by https://www.figma.com/community/file/1026170425902325131/loginuiconcept
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
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
        
        // Set the token and show success message
        setToken(oauthToken);
        toast.success("Welcome back!", {
            description: `Successfully signed in with Google. Redirecting to your profile...`,
            duration: 3000,
        });
        
        // Navigate after a brief delay to ensure toast is visible
        setTimeout(() => {
            navigate("/user-info", { replace: true });
        }, 500);
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
        <main className="flex flex-col items-center justify-start gap-4">
            <div className="flex items-stretch bg-slate-200 rounded-xl shadow-xl overflow-hidden w-full max-w-5xl">
                <div className="md:p-6 flex-1 flex items-center justify-center">
                    <img
                        src={illustration}
                        alt="illustration"
                        className="max-h-125 object-contain"
                    />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center items-center gap-6">
                    <h2 className="font-bold text-2xl md:text-4xl text-center">
                        Create your Free Account
                    </h2>
                    <Button
                        className="gsi-material-button"
                        disabled={!googleOauthUrl}
                        onClick={() => {
                            window.location.href = googleOauthUrl;
                        }}
                    >
                        <div className="gsi-material-button-state"></div>
                        <div className="gsi-material-button-content-wrapper">
                            <div className="gsi-material-button-icon">
                                <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    style={{ display: "block" }}
                                >
                                    <path
                                        fill="#EA4335"
                                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                    ></path>
                                    <path
                                        fill="#4285F4"
                                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                    ></path>
                                    <path
                                        fill="#FBBC05"
                                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                    ></path>
                                    <path
                                        fill="#34A853"
                                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                    ></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                            </div>
                            <span className="gsi-material-button-contents">
                                Sign in with Google
                            </span>
                            <span style={{ display: "none" }}>
                                Sign in with Google
                            </span>
                        </div>
                    </Button>
                    <p className="text-xs md:text-sm text-muted-foreground text-center">
                        By signing in with Google, you agree to our Terms of
                        Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </main>
    );
}
