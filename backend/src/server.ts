import app from "./app.js";
import "dotenv/config";
import { connectDB } from "./config/database.js";



const PORT = process.env.PORT;

const startServer = async () => {
try {
    await connectDB();

app.listen(PORT, () => {
    console.log("server is running");
});
}
catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
}
}

await startServer();