import GDrivePicker from "@/components/google/GDrivePicker";
import { Button } from "@/components/ui/button";
import logout from "@/utils/logout";
import { useState } from "react";
import { useToken } from "../utils/useToken";

export function UserInfoPage() {
    const { user } = useToken();
    const [showPicker, setShowPicker] = useState(false);

    return (
        <main style={{ padding: "2rem" }}>
            <h1>User Info</h1>

            <pre style={{ marginTop: "1rem" }}>
                {JSON.stringify(user, null, 2)}
            </pre>

            {showPicker ? (
                <GDrivePicker />
            ) : (
                <Button
                    style={{ marginTop: "1rem" }}
                    onClick={() => setShowPicker(!showPicker)}
                >
                    Show Google Drive Picker
                </Button>
            )}

            <Button style={{ marginTop: "1rem" }} onClick={logout}>
                Log out
            </Button>
        </main>
    );
}
