import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/User.js";
import {
  getGoogleOauthUrl,
  getGoogleUser,
  refreshGoogleAccessToken,
  updateOrCreateUserFromOauth,
} from "../utils/googleOauthUtil.js";
import { getGoogleSheetData } from "../utils/googleSheetsUtil.js";
import { validateSheetForCRM } from "../utils/crmValidator.js";
import { parseContactsFromSheet } from "../utils/contactParser.js";

const GOOGLE_REDIRECT_BASE_URI =
  "https://google-oauth-app-git-te-3bbc65-phillip-cantus-projects-a53de6f9.vercel.app";
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

/* -------------------------------------------------------------------------- */
/*                              Parse Sheet Route                              */
/* -------------------------------------------------------------------------- */

export const parseSheetRoute: RequestHandler = async (req, res) => {
  try {
    // Extract fileId and userId from request body
    const fileId = req.body.fileId;
    const userId = req.body.userId;

    // Validate that we have the required data
    if (!fileId) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: fileId",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: userId",
      });
    }

    // Find the user in the database to get their access token
    const existingUser = await UserModel.findOne({
      googleId: userId,
    }).exec();

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found. Please log in again.",
      });
    }

    if (!existingUser.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Access token not found. Please log in again.",
      });
    }

    // Step 1: Fetch the sheet data from Google Sheets API
    const sheetDataResult = await getGoogleSheetData(
      fileId,
      existingUser.accessToken,
    );

    if (!sheetDataResult.success || !sheetDataResult.data) {
      return res.status(400).json({
        success: false,
        error: sheetDataResult.error || "Failed to read the Google Sheet",
      });
    }

    // Step 2: Validate the sheet structure for CRM use
    const validationResult = validateSheetForCRM(sheetDataResult.data);

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error:
          validationResult.errorMessage || "Sheet is not valid for CRM use",
      });
    }

    // Step 3: Parse the sheet data into Contact objects
    const parseResult = parseContactsFromSheet(
      sheetDataResult.data,
      validationResult,
    );

    if (!parseResult.success || !parseResult.contacts) {
      return res.status(400).json({
        success: false,
        error: parseResult.error || "Failed to parse contacts from sheet",
      });
    }

    // Return the parsed contacts
    return res.status(200).json({
      success: true,
      contacts: parseResult.contacts,
      message: `Successfully loaded ${parseResult.contacts.length} contact(s) from the sheet`,
    });
  } catch (err) {
    // Enhanced error logging
    console.error("❌ Error in parseSheetRoute:");
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
      success: false,
      error: "An internal server error occurred while processing the sheet",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
