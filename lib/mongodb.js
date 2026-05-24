const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('⏳ Connecting to MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB Connected Successfully to Remote Atlas');
        global.isMockDB = false;
        return mongooseInstance;
      })
      .catch(async (err) => {
        console.warn('⚠️ MongoDB Atlas Connection Error:', err.message);
        console.log('🔄 Attempting fallback to local in-memory MongoDB Server...');
        
        try {
          const { MongoMemoryServer } = require('mongodb-memory-server');
          const mongoServer = await MongoMemoryServer.create();
          const localUri = mongoServer.getUri();
          
          console.log(`🚀 In-Memory MongoDB Server started successfully!`);
          
          const localMongoose = await mongoose.connect(localUri, opts);
          console.log('✅ MongoDB Connected Successfully to Local In-Memory Server');
          
          global.isMockDB = true;
          global.mongoServerInstance = mongoServer;
          return localMongoose;
        } catch (fallbackErr) {
          console.error('❌ Local fallback database failed:', fallbackErr.message);
          throw err; // throw original Atlas error if fallback fails
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
