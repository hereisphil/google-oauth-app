import { google } from "googleapis";

const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/google/callback",
);

export const getGoogleOauthUrl = () => {
    const scopes = ["email", "profile"];

    return oauthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
};
