import "dotenv/config";
import dns from "node:dns";

import app from "./app.js";
import connectDB from "./config/db.js";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


const PORT = process.env.PORT || 5000;

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server only after DB connection succeeds
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:",error.message);

    process.exit(1);
  }
};

startServer();
