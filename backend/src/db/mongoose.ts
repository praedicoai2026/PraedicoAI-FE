import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectToDatabase() {
  const uri = new URL(env.MONGODB_URI);
  uri.username = "";
  uri.password = "";

  await mongoose.connect(uri.toString(), {
    user: env.DB_USER,
    pass: env.DB_PASSWORD,
    authSource: "admin",
  });
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export async function pingDatabase() {
  const database = mongoose.connection.db;
  if (!database) {
    throw new Error("MongoDB connection is not initialized");
  }

  await database.admin().ping();
}
