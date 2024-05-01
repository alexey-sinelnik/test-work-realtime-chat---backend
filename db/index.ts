import mongoose from 'mongoose';

const connectToMongoDb = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log('Connect to Mongo db'));
  } catch (error: unknown) {
    console.log(error);
  }
};

export default connectToMongoDb;
