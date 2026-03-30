import mongoose from "mongoose"

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
}

globalThis.mongooseCache = cached

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads.
 * @returns Promise resolving to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  const mongodbUri = process.env.MONGODB_URI

  if (!mongodbUri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    )
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(mongodbUri, options).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB
