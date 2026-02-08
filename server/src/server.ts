import "dotenv/config";
import app from "./app/app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`NodeJS/Express Server running on http://localhost:${PORT}`);
});
