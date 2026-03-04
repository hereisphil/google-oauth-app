import GDrivePicker from "@/components/google/GDrivePicker";
import { Button } from "@/components/ui/button";
import { ContactCard, type Contact } from "@/components/crm/ContactCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useToken } from "../utils/useToken";

export function UserInfoPage() {
  const { user, refetchUser } = useToken();
  const [showPicker, setShowPicker] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  // Debug: log when Picker is about to open so we can verify token/env on Vercel
  useEffect(() => {
    if (showPicker && user) {
      console.log("[UserInfoPage] Opening Picker with:", {
        hasUser: Boolean(user),
        hasAccessToken: Boolean(user?.accessToken),
        accessTokenLength: user?.accessToken?.length ?? 0,
      });
    }
  }, [showPicker, user]);

  useEffect(() => {
    if (!user) return;
    // Check if user's access token is expired and refresh if needed
    const checkAndRefreshToken = async () => {
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

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
          // Refetch user so context has the new accessToken; Picker will then use fresh token
          await refetchUser();
          console.log(
            "[UserInfoPage] User refetched after refresh; Picker will use updated accessToken.",
          );
        }
      } catch (err) {
        console.error("❌ Error refreshing token:", err);
      }
    };

    checkAndRefreshToken();
  }, [refetchUser]);

  // Handle when user cancels the picker
  const handlePickerCancel = () => {
    setShowPicker(false);
    // Show a friendly toast notification
    toast.info("Google Drive Picker canceled", {
      description:
        "You can open the picker again anytime using the same button.",
      duration: 3000,
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                      Handles when the user selects a Google Sheet           */
  /* -------------------------------------------------------------------------- */

  const handlePickerPicked = async (pickerEventData: unknown) => {
    setShowPicker(false);
    setIsLoadingSheet(true);
    setSheetError(null);

    try {
      // Extract file ID from the picker event
      // The structure is: { docs: [{ id: "fileId", name: "fileName", ... }] }
      const eventData = pickerEventData as {
        docs?: Array<{ id: string; name: string }>;
      };

      if (!eventData.docs || eventData.docs.length === 0) {
        throw new Error("No file selected");
      }

      const selectedFile = eventData.docs[0];
      const fileId = selectedFile.id;
      const fileName = selectedFile.name;

      if (!user || !user.googleId) {
        throw new Error("User not found. Please log in again.");
      }

      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

      // Call the backend API to parse the sheet
      const response = await fetch(`${API_BASE}/api/v1/sheets/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: fileId,
          userId: user.googleId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        // Handle error response
        const errorMessage =
          responseData.error ||
          "Failed to process the sheet. Please try again.";
        setSheetError(errorMessage);
        toast.error("Sheet Processing Failed", {
          description: errorMessage,
          duration: 5000,
        });
        setIsLoadingSheet(false);
        return;
      }

      // Success! Display the contacts
      const parsedContacts = responseData.contacts || [];

      setContacts(parsedContacts);
      setIsLoadingSheet(false);

      toast.success("Sheet Loaded Successfully!", {
        description: `Found ${parsedContacts.length} contact(s) in "${fileName}"`,
        duration: 3000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while processing the sheet.";
      setSheetError(errorMessage);
      setIsLoadingSheet(false);
      toast.error("Error Processing Sheet", {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                        Resets the view to allow selecting a new sheet      */
  /* -------------------------------------------------------------------------- */

  const handleSelectNewSheet = () => {
    setContacts([]);
    setSheetError(null);
    setShowPicker(true);
  };

  // console.log("UserInfoPage user >>>", user);

  return (
    <main className="flex flex-col items-center gap-8 p-4">
      <h1 className="font-bold text-3xl underline underline-offset-4">
        User Info
      </h1>

      <div className="mt-4 w-full max-w-3xl bg-card text-card-foreground border rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {user?.pictureUrl && (
            <img
              src={user.pictureUrl}
              alt={user.name}
              className="h-16 w-16 rounded-full border object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">Google ID</p>
            <p className="break-all">{user?.googleId}</p>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">
              Access Token Expires
            </p>
            <p>
              {user?.accessTokenExpiresAt
                ? new Date(user.accessTokenExpiresAt).toLocaleString()
                : "—"}
            </p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <p className="font-medium text-muted-foreground">Access Token</p>
            <p className="break-all text-xs bg-muted rounded-lg p-2">
              {user?.accessToken}
            </p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <p className="font-medium text-muted-foreground">Refresh Token</p>
            <p className="break-all text-xs bg-muted rounded-lg p-2">
              {user?.refreshToken}
            </p>
          </div>
        </div>
      </div>

      {/* Show picker if no contacts loaded and not loading */}
      {showPicker && !isLoadingSheet ? (
        <GDrivePicker
          oauthToken={user?.accessToken || ""}
          onCancel={handlePickerCancel}
          onPicked={handlePickerPicked}
        />
      ) : null}

      {/* Loading state */}
      {isLoadingSheet && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            Processing your Google Sheet...
          </p>
        </div>
      )}

      {/* Error state */}
      {sheetError && !isLoadingSheet && (
        <div className="w-full max-w-2xl">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg text-destructive">
              Sheet Processing Error
            </h2>
            <p className="text-sm text-muted-foreground">{sheetError}</p>
            <Button onClick={handleSelectNewSheet} variant="outline">
              Try Another Sheet
            </Button>
          </div>
        </div>
      )}

      {/* Contacts grid */}
      {contacts.length > 0 && !isLoadingSheet && (
        <div className="w-full max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Your Contacts ({contacts.length})
            </h2>
            <Button onClick={handleSelectNewSheet} variant="outline">
              Select Different Sheet
            </Button>
          </div>

          {/* Grid layout: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}

      {/* Show picker button when no contacts, no error, and not loading */}
      {!showPicker &&
        !isLoadingSheet &&
        contacts.length === 0 &&
        !sheetError && (
          <Button onClick={() => setShowPicker(true)} size="lg">
            Select Google Sheet
          </Button>
        )}
    </main>
  );
}
