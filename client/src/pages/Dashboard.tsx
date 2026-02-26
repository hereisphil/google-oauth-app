import GDrivePicker from "@/components/google/GDrivePicker";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useToken } from "../utils/useToken";

export function Dashboard() {
  const { user } = useToken();
  const [showPicker, setShowPicker] = useState(false);

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

  // Handle when user cancels the picker
  const handlePickerCancel = () => {
    setShowPicker(false);
    // Show a friendly toast notification
    toast.info("Google Drive Picker canceled", {
      description: "You can open the picker again anytime using the button below.",
      duration: 3000,
    });
  };

  // Handle when user picks a file
  const handlePickerPicked = (data: unknown) => {
    console.log("File picked:", data);
    setShowPicker(false);
    toast.success("File selected successfully!", {
      description: "You can process the selected file now.",
      duration: 3000,
    });
  };

  return (
    <main className="flex flex-col items-center gap-8">
      <h1 className="font-bold text-3xl underline underline-offset-4">
        Dashboard
      </h1>
      {showPicker ? (
        <GDrivePicker
          oauthToken={user?.accessToken || ""}
          onCancel={handlePickerCancel}
          onPicked={handlePickerPicked}
        />
      ) : (
        <Button onClick={() => setShowPicker(true)}>
          Show Google Drive Picker
        </Button>
      )}
    </main>
  );
}
