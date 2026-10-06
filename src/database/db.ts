import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached = globalWithMongoose.mongoose ?? { conn: null, promise: null };
globalWithMongoose.mongoose = cached;

/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function before all api routes
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const url = process.env.MONGO_URI;
  if (!url) {
    throw new Error("MONGO_URI must be set before using the products API");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(url, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

export default connectDB;
