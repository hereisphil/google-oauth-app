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

            <pre className="mt-2 bg-accent border-2 shadow-2xl rounded-2xl p-4 overflow-auto max-w-300">
                {JSON.stringify(user, null, 2)}
            </pre>
        </main>
    );
}
