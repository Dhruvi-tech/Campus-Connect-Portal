import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_connect';
    const conn = await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`🚨 MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
