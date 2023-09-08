const { connect } = require("mongoose");

require("dotenv").config();

const URL = process.env.DATABASE;
const connectDB = async () => {
  try {
    const mongoURI = URL;
    const options = {
      dbName: "Flipkart",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await connect(mongoURI, options);
    console.log("MongoDB Connected...");
    // await redisClient.connect()
    // console.log("Redis Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;