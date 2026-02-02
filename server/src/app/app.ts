import cors from "cors";
import express, { type Request, type Response } from "express";
import morgan from "morgan";

// Basic initial server app setup
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors()); // Will likely need to explicitly give allowed origin urls

//TODO: Setup route handler
//TODO: Setup express-session
//TODO: Setup 404 routes

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        message: "Server is running.",
        success: true,
    });
});

export default app;
