import mongoose from "mongoose";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: Cached | undefined;
}

const cache: Cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Set it in .env.local (Atlas or local MongoDB).",
    );
  }
  return uri;
}

/**
 * Connect to MongoDB (Atlas or local). Connection is cached across
 * hot reloads in development to avoid creating multiple connections.
 */
export async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  const uri = getMongoUri();

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
