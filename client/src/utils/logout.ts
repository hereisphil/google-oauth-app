import { toast } from "sonner";

const logout = () => {
    // Show friendly logout message
    toast.info("Logged out successfully", {
        description: "You have been signed out. We hope to see you again soon!",
        duration: 2000,
    });
    
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Redirect to login page after a brief delay so toast is visible
    setTimeout(() => {
        window.location.href = "/login";
    }, 500);
};

export default logout;
