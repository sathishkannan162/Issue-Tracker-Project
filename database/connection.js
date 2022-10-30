let mongoose = require("mongoose");
require("dotenv").config();
let dbName = "IssueTracker";

async function main(callback) {
  let IssueModel = require("./issue");

  try {
    await mongoose
      .connect(process.env.MONGO_URI + "/" + dbName)
      .then(() => {
        console.log("database connection successful");
      })
      .catch((err) => {
        console.log("database error:", err);
        console.log("database connection error");
      });

    await callback(IssueModel);
  } catch (error) {
    console.log(err);
    throw new Error("Database connection error");
  }
}

module.exports = main;