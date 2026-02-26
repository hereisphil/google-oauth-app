import "dotenv/config";
import cors from "cors";
import express, { type Request, type Response } from "express";
import morgan from "morgan";
import connectDB from "./app/db/config.js";
import routeHandler from "./app/routes/index.js";

await connectDB();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.listen(3001, () => {
  console.log(`NodeJS/Express Server running on http://localhost:3001`);
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running.",
    success: true,
  });
});

// API Routes
app.use("/api/v1", routeHandler);

export default app;
