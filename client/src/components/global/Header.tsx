import { Button } from "@/components/ui/button";
import logout from "@/utils/logout";
import { useToken } from "@/utils/useToken";
import { useNavigate } from "react-router";

const Header = () => {
    const { user } = useToken();
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center p-4 mb-4 border-b bg-gray-100">
            <Button variant="link" onClick={() => navigate("/")}>
                Google OAuth App
            </Button>
            {user ? (
                <div className="flex gap-2 items-center">
                    <span className="font-bold text-lg">
                        Hello, {user.name}!
                    </span>
                    <Button size="sm" onClick={() => navigate("user-info")}>
                        Profile
                    </Button>
                    <Button variant="destructive" size="sm" onClick={logout}>
                        Log out
                    </Button>
                </div>
            ) : (
                <Button onClick={() => navigate("/login")}>Log in</Button>
            )}
        </header>
    );
};

export default Header;
