import { google } from "googleapis";

const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/auth/google/callback",
);

export const getGoogleOauthUrl = () => {
    const scopes = ["email", "profile"];

    return oauthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
};

export const getGoogleUser = async (code) => {
    try {
        const { tokens } = await oauthClient.getToken(code);
        // console.log("OAUTH TOKENS >>>", tokens);
        // Example response:
        /* {
            access_token: 'STRING',
            refresh_token: 'STRING',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
            token_type: 'Bearer',
            id_token: 'STRING',
            expiry_date: 1770496093586
        }
        */
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
            { headers: { Authorization: `Bearer ${tokens.id_token}` } },
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
