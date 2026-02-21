import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/User.js";
import {
    getGoogleOauthUrl,
    getGoogleUser,
    refreshGoogleAccessToken,
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

export const refreshGoogleTokenRoute: RequestHandler = async (req, res) => {
    try {
        const id = req.body.userId;
        if (!id) {
            return res.status(400).json({ message: "Missing user ID" });
        }
        const existingUser = await UserModel.findOne({
            googleId: id,
        }).exec();
        if (!existingUser)
            return res.status(400).json({
                message: "User not found",
                success: false,
            });

        if (!existingUser.refreshToken) {
            return res.status(400).json({
                message: "Refresh token not found",
                success: false,
            });
        }

        const refreshed = await refreshGoogleAccessToken(
            existingUser.refreshToken,
        );

        existingUser.accessToken = refreshed.accessToken;
        if (refreshed.accessTokenExpiresAt) {
            existingUser.accessTokenExpiresAt = refreshed.accessTokenExpiresAt;
        }
        await existingUser.save();

        return res.status(200).json({ message: "Token refreshed" });
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};
