import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Cache the connection across hot reloads in development
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};
let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

const connectionCache = cached;

async function dbConnect() {
  if (connectionCache.conn) {
    return connectionCache.conn;
  }

  if (!connectionCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    connectionCache.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    connectionCache.conn = await connectionCache.promise;
  } catch (e) {
    connectionCache.promise = null;
    console.error("Failed to connect to MongoDB Atlas:", e);
    throw e;
  }

  return connectionCache.conn;
}

export default dbConnect;
