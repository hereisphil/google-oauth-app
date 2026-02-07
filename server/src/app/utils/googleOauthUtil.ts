import { google } from "googleapis";

const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/api/v1/auth/google/callback",
);

export const getGoogleOauthUrl = () => {
    const scopes = ["openid", "email", "profile"];

    return oauthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
};

interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
    verified_email: boolean;
}

export const getGoogleUser = async (
    code: string,
): Promise<GoogleUser | undefined> => {
    try {
        const { tokens } = await oauthClient.getToken(code);

        if (!tokens.access_token) {
            throw new Error("Missing access_token from Google token response");
        }

        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
            { headers: { Authorization: `Bearer ${tokens.id_token}` } },
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                `Google userinfo failed: ${response.status} ${message}`,
            );
        }

        const data = (await response.json()) as GoogleUser;
        return data;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};
