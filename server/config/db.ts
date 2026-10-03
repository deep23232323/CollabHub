import mongoose from 'mongoose';

export async function connectDB() {
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI is not set. Operating with in-memory database fallback.');
    return false;
  }

  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Connected to MongoDB database successfully.');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB database:', error);
    return false;
  }
}


