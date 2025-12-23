import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect('mongodb://Ashraf:ashraf123%23@localhost:27017/storageApp');
    console.log('mongodb database connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log('client disconnected!');
  process.exit(0);
});
