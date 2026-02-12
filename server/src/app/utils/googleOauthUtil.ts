import { google } from "googleapis";
import UserModel from "../model/User.js";

/* -------------------------------------------------------------------------- */
/*                            TS Types & Interfaces                           */
/* -------------------------------------------------------------------------- */
interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    picture: string;
}

type OAuthUserPayload = {
    googleId: string;
    email: string;
    name?: string;
    pictureUrl?: string;
    accessToken: string;
    refreshToken?: string | undefined;
    accessTokenExpiresAt?: Date | undefined;
};

/* -------------------------------------------------------------------------- */
/*                             Let The Magic Begin                            */
/* -------------------------------------------------------------------------- */
const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URI ||
        "http://localhost:3001/api/v1/auth/google/callback",
);

export const getGoogleOauthUrl = () => {
    const scopes = [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
    ];

    return oauthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
};

export const getGoogleUser = async (
    code: string,
): Promise<OAuthUserPayload | undefined> => {
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
            "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
            {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            },
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(
                `Google userinfo failed: ${response.status} ${message}`,
            );
        }

        const data = (await response.json()) as GoogleUser;

        // Build payload
        const user: OAuthUserPayload = {
            googleId: data.id,
            email: data.email,
            name: data.name,
            pictureUrl: data.picture,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || undefined,
            accessTokenExpiresAt: tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : undefined,
        };

        // Google Drive scope
        const filesResponse = await fetch(
            "https://www.googleapis.com/drive/v3/files?pageSize=5&fields=files(id,name)",
            { headers: { Authorization: `Bearer ${tokens.access_token}` } },
        );
        const filesData = await filesResponse.json();
        console.log("USER FILES >>>", filesData);

        return user;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

export const updateOrCreateUserFromOauth = async (
    payload: OAuthUserPayload,
) => {
    const {
        googleId,
        email,
        name,
        pictureUrl,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
    } = payload;

    // Build updated user object:
    // - Always update accessToken
    // - Only update refreshToken if one received
    const update: Record<string, unknown> = {
        email,
        name,
        pictureUrl,
        accessToken,
        accessTokenExpiresAt,
    };

    if (refreshToken) {
        update.refreshToken = refreshToken;
    }

    return await UserModel.findOneAndUpdate(
        { googleId },
        {
            $set: update,
            $setOnInsert: { googleId },
        },
        {
            new: true,
            upsert: true,
        },
    ).exec();
};
