require("./database");
let mongoose = require("mongoose");
let sampleData = require("./sampleIssues");
let IssueModel = require("./issue");

IssueModel.insertMany(sampleData)
  .then((docs) => {
    console.log(docs);
  })
  .catch((err) => {
    console.log(err);
  });
