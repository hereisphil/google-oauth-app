import { useMemo } from "react";
import { decodeJWTPayload } from "../utils/decodeJwtPayload";
import { useToken } from "../utils/useToken";


export const UserInfoPage = () => {
    const { token } = useToken(); // Get token

    // Create user object as a memorized value
    const user = useMemo(() => {
        if (!token) return null;
        try {
            const payload = decodeJWTPayload(token);
            // console.log("Decoded JWT Payload:", payload);
            // Example object:
            /*
            {
                "id": "100832796974636964746",
                "email": "thereisphil@gmail.com",
                "name": "Phillip Cantu",
                "picture": "https://lh3.googleusercontent.com/a/ACg8ocIVzWll7YrhCqwR3qZxAvkMN0Ox5e9kbfNeepCxLg8d6A3AsJyr=s96-c",
                "iat": 1770676173,
                "exp": 1770677073
            }
            */
            return {
                email: payload.email ?? "",
                name: payload.name ?? "",
                picture: payload.picture ?? "",
            };
        } catch (err) {
            console.error("Error decoding JWT payload:", err);
            return null;
        }
    }, [token]);

    if(!user) return <main><h1>Welcome</h1></main>

    return (
        <main>
            <h1>Welcome {user.name}</h1>
            <h2>{user.email}</h2>
            <img src={user.picture} alt={`{user.name}'s Google Profile Picture`} style={{width: "100%", maxWidth: "300px", borderRadius: "1rem"}} />
        </main>
    )
};
