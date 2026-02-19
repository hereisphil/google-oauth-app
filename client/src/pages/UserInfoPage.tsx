import GDrivePicker from "@/components/google/GDrivePicker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToken } from "../utils/useToken";

export function UserInfoPage() {
    const { user } = useToken();
    // console.log("UserInfoPage user >>>", user);
    const [showPicker, setShowPicker] = useState(false);

    return (
        <main className="flex flex-col items-center gap-8">
            <h1 className="font-bold text-3xl underline underline-offset-4">
                User Info
            </h1>

            {showPicker ? (
                <GDrivePicker oauthToken={user?.accessToken || ""} />
            ) : (
                <Button onClick={() => setShowPicker(!showPicker)}>
                    Show Google Drive Picker
                </Button>
            )}

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
                        <p className="text-muted-foreground text-sm">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">
                            Google ID
                        </p>
                        <p className="break-all">{user?.googleId}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">
                            Access Token Expires
                        </p>
                        <p>
                            {user?.accessTokenExpiresAt
                                ? new Date(
                                      user.accessTokenExpiresAt,
                                  ).toLocaleString()
                                : "—"}
                        </p>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <p className="font-medium text-muted-foreground">
                            Access Token
                        </p>
                        <p className="break-all text-xs bg-muted rounded-lg p-2">
                            {user?.accessToken}
                        </p>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <p className="font-medium text-muted-foreground">
                            Refresh Token
                        </p>
                        <p className="break-all text-xs bg-muted rounded-lg p-2">
                            {user?.refreshToken}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
