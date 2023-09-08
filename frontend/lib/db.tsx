// mongodb.js

import { MongoClient } from 'mongodb';

let client;
// const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
const uri = process.env.DB

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  return client;
}

export async function getDatabase() {
  return connectToDatabase();
}

