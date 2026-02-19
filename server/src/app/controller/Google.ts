import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import {
    getGoogleOauthUrl,
    getGoogleUser,
    updateOrCreateUserFromOauth,
} from "../utils/googleOauthUtil.js";

const GOOGLE_REDIRECT_BASE_URI =
    process.env.GOOGLE_REDIRECT_BASE_URI || "http://localhost:5173";

export const getGoogleOauthUrlRoute: RequestHandler = async (_req, res) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({ url });
};

export const callbackRoute: RequestHandler = async (req, res) => {
    try {
        const code = String(req.query.code || ""); // Google gives us the code in the URL
        if (!code) return res.status(400).send("Missing code");

        const googleUser = await getGoogleUser(code);
        if (!googleUser) return res.sendStatus(500);
        const createdUser = await updateOrCreateUserFromOauth(googleUser); // New user from Google OAuth
        const token = jwt.sign(
            {
                // Create token only with an identifier (googleId), no sensitive info
                id: createdUser.googleId,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "36h" },
        );

        return res.redirect(`${GOOGLE_REDIRECT_BASE_URI}/login?token=${token}`);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};
