import { Button } from "@/components/ui/button";
import logout from "@/utils/logout";
import { useToken } from "@/utils/useToken";
import { Hash, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router";

const Header = () => {
    const { user } = useToken();
    const navigate = useNavigate();

    return (
        <header className="flex justify-between items-center p-4 mb-4 border-b bg-accent">
            <Link
                to="/"
                className="font-bold text-sm md:text-xl hover:underline"
            >
                <Hash className="inline-block" />
                Google OAuth App
            </Link>
            {user ? (
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <span className="font-bold text-sm md:text-lg">
                        Hello, {user.name}!
                    </span>
                    <div className="flex gap-2 justify-center items-center">
                        <Button size="sm" onClick={() => navigate("dashboard")}>
                            <User className="mr-0.5" />
                            Dashboard
                        </Button>
                        <Button size="sm" onClick={() => navigate("user-info")}>
                            <User className="mr-0.5" />
                            Profile
                        </Button>
                        <Button variant="ghost" size="xs" onClick={logout}>
                            <LogOut className="mr-0.5" />
                            Log out
                        </Button>
                    </div>
                </div>
            ) : (
                <Button onClick={() => navigate("/login")}>Log in</Button>
            )}
        </header>
    );
};

export default Header;
