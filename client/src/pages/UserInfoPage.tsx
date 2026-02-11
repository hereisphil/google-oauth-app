import { Button } from "@/components/ui/button";
import { useToken } from "../utils/useToken";

export function UserInfoPage() {
    const { user } = useToken();

    return (
        <main style={{ padding: "2rem" }}>
            <h1>User Info</h1>

            <pre style={{ marginTop: "1rem" }}>
                {JSON.stringify(user, null, 2)}
            </pre>

            <Button
                style={{ marginTop: "1rem" }}
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            >
                Log out
            </Button>
        </main>
    );
}
