import GDrivePicker from "@/components/google/GDrivePicker";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToken } from "../utils/useToken";

export function Dashboard() {
  const { user } = useToken();
  useEffect(() => {
    if (!user) return;
    // Check if user's access token is expired and refresh if needed
    const checkAndRefreshToken = async () => {
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

      console.log("🔄 Dashboard: Checking if token needs refresh...");
      console.log("User googleId:", user.googleId);

      try {
        // Send POST request with proper JSON body
        // The backend expects: { userId: "googleId" }
        const response = await fetch(`${API_BASE}/api/v1/auth/google/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Important: tells server to parse as JSON
            Authorization: user.accessToken || "",
          },
          body: JSON.stringify({
            userId: user.googleId,
          }),
        });

        if (!response.ok) {
          // Try to get error details from response
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Failed to refresh token:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
        } else {
          const data = await response.json();
          console.log("✅ Token refreshed successfully:", data);
        }
      } catch (err) {
        console.error("❌ Error refreshing token:", err);
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
