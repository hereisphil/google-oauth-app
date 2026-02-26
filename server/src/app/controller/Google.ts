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
    // Extract userId from request body
    const id = req.body.userId;
    if (!id) {
      // Missing user ID in request body
      return res.status(400).json({
        message: "Missing user ID",
        success: false,
      });
    }

    // Find user in database
    const existingUser = await UserModel.findOne({
      googleId: id,
    }).exec();

    if (!existingUser) {
      // User not found with googleId
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if refresh token exists
    if (!existingUser.refreshToken) {
      return res.status(400).json({
        message: "Refresh token not found",
        success: false,
      });
    }

    // Refresh the Google access token using the refresh token
    const refreshed = await refreshGoogleAccessToken(existingUser.refreshToken);

    // Update user with new tokens
    existingUser.accessToken = refreshed.accessToken;
    if (refreshed.accessTokenExpiresAt) {
      existingUser.accessTokenExpiresAt = refreshed.accessTokenExpiresAt;
    }
    await existingUser.save();

    // User record updated in database
    return res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
    });
  } catch (err) {
    console.error(
      "Error type:",
      err instanceof Error ? err.constructor.name : typeof err,
    );
    console.error(
      "Error message:",
      err instanceof Error ? err.message : String(err),
    );
    console.error("Full error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
      success: false,
    });
  }
};
