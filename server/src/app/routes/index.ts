import type { Request, Response } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { getGoogleOauthUrl, getGoogleUser, updateOrCreateUserFromOauth } from "../utils/googleOauthUtil.js";
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
router.get("/auth/google/url", (_req, res) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({ url });
});

router.get("/auth/google/callback", async (req, res) => {
    try {
        const code = String(req.query.code || ""); // Google gives us the code in the URL
        if (!code) return res.status(400).send("Missing code");

        const googleUser = await getGoogleUser(code);
        if (!googleUser) return res.sendStatus(500);
        // console.log("Google User:", googleUser);
        // EXAMPLE GOOGLE USER OBJECT RETURNED:
        /*
        Google User: {
            id: '100832796974636964746',
            email: 'thereisphil@gmail.com',
            verified_email: true,
            name: 'Phillip Cantu',
            given_name: 'Phillip',
            family_name: 'Cantu',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocIVzWll7YrhCqwR3qZxAvkMN0Ox5e9kbfNeepCxLg8d6A3AsJyr=s96-c'
          }
        */
        const createdUser = await updateOrCreateUserFromOauth(googleUser); // New user from Google OAuth
        const token = jwt.sign(
            {
                id: createdUser.googleId,
                email: createdUser.email,
                name: createdUser.name,
                picture: createdUser.pictureUrl,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" },
        );

        return res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

export default router;
