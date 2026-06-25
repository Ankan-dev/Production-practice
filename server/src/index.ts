import mongoose from "mongoose";
import { config } from "./config";
import app from "./app";

async function start() {
  if (!config.mongoUri || !config.jwtSecret) {
    throw new Error("Missing MONGO_URI or JWT_SECRET in server environment");
  }

  await mongoose.connect(config.mongoUri);
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
