import { google } from "googleapis";
import type { User } from "../model/User.js";
import UserModel from "../model/User.js";

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
    verified_email: boolean;
    name: string;
    picture: string;
}

export const getGoogleUser = async (
    code: string,
): Promise<GoogleUser | undefined> => {
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

export const updateOrCreateUserFromOauth = async (user: GoogleUser) => {
    const { id, email, name, picture } = user;

    const existingUser = await UserModel.findOne({ googleId: id }).exec();
    if (existingUser) {
        return existingUser;
    } else {
        const newUser: User = await UserModel.create({
            googleId: id,
            email,
            name,
            pictureUrl: picture,
        });

        return newUser;
    }
};
