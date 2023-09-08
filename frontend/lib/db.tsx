// utils/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    const url = process.env.DB
  try {
    await mongoose.connect("mongodb://mongo:0ETKIT9O2UYwmLjWCzna@containers-us-west-78.railway.app:5542", {
      dbName: 'flipkart',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
  }
};

export default connectDB;
