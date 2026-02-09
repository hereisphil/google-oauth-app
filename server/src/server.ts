import "dotenv/config";
import app from "./app/app.js";
import connectDB from "./app/db/config.js";

await connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`NodeJS/Express Server running on http://localhost:${PORT}`);
});
