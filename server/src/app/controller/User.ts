import type { RequestHandler } from "express";
import UserModel from "../model/User.js";
import { decodeJWTPayload } from "../utils/decodeJwtPayload.js";

/* -------------------------------------------------------------------------- */
/*                       GET Authenticated User Details                       */
/* -------------------------------------------------------------------------- */
export const getAuthenticatedUser: RequestHandler = async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            return res.status(400).json({
                message: "Please login.",
                success: false,
            });
        const payload = await decodeJWTPayload(authorization);
        const expiration = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        if (expiration && expiration < now) {
            return res.status(401).json({
                message: "Login expired",
                success: false,
            });
        }

        const existingUser = await UserModel.findOne({
            googleId: payload.id,
        }).exec();
        if (!existingUser)
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        return res.status(200).json(existingUser);
    } catch (err) {
        return res.status(500).json({
            message: "Internal error",
            success: false,
        });
    }
};
