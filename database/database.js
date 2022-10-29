let mongoose = require("mongoose");
require("dotenv").config();
let dbName = "IssueTracker";

class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(process.env.MONGO_URI + "/" + dbName)
      .then(() => {
        console.log("database connection successful");
      })
      .catch((err) => {
        console.log("database connection error");
      });
  }
}

module.exports = new Database();