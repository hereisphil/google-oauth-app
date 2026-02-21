import type { Request, Response } from "express";
import express from "express";
import {
    callbackRoute,
    getGoogleOauthUrlRoute,
    refreshGoogleTokenRoute,
} from "../controller/Google.js";
import { getAuthenticatedUser } from "../controller/User.js";
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
/*                           Routed for Google OAuth                          */
/* -------------------------------------------------------------------------- */
router.get("/auth/google/url", getGoogleOauthUrlRoute);

router.get("/auth/google/callback", callbackRoute);

router.post("/auth/google/refresh", refreshGoogleTokenRoute);

/* -------------------------------------------------------------------------- */
/*                             Verify Token Route                             */
/* -------------------------------------------------------------------------- */
router.get("/auth/token", getAuthenticatedUser);

export default router;
