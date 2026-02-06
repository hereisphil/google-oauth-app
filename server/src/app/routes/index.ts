import type { Request, Response } from "express";
import express from "express";
import { getGoogleOauthUrl } from "../utils/googleOauthUtil.js";
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                            Route to Test Server                            */
/* -------------------------------------------------------------------------- */
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "API is running",
        request: `${req.method} - Request made`,
        success: true,
    });
});

/* -------------------------------------------------------------------------- */
/*                           Route for Google OAuth                           */
/* -------------------------------------------------------------------------- */
router.get("/auth/google/url", (_req, res) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({ url });
});

export default router;
