import GDrivePicker from "@/components/google/GDrivePicker";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToken } from "../utils/useToken";

export function Dashboard() {
    const { user } = useToken();
    useEffect(() => {
        // Check if user's access token is expired and refresh if needed
        const checkAndRefreshToken = async () => {
            if (user) {
                try {
                    const response = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google/refresh`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: user.accessToken || "",
                            },
                            body: user.googleId,
                        },
                    );
                    if (!response.ok) {
                        console.error("Failed to refresh token");
                    }
                } catch (err) {
                    console.error("Error refreshing token:", err);
                }
            }
        };

        checkAndRefreshToken();
    }, [user]);

    const [showPicker, setShowPicker] = useState(false);
    return (
        <main className="flex flex-col items-center gap-8">
            <h1 className="font-bold text-3xl underline underline-offset-4">
                Dashboard
            </h1>
            {showPicker ? (
                <GDrivePicker oauthToken={user?.accessToken || ""} />
            ) : (
                <Button onClick={() => setShowPicker(!showPicker)}>
                    Show Google Drive Picker
                </Button>
            )}
        </main>
    );
}
