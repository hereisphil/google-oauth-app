import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";

export const useToken = () => {
    const context = useContext(TokenContext);
    if (!context)
        throw new Error("useToken must be used within <TokenProvider>");
    // console.log("useToken context >>>", context);
    return context; // { token, user, setToken }
};
