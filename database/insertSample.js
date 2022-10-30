let myDB = require("./connection");
let sampleData = require("./sampleIssues");


myDB( async IssueModel=>{
  await IssueModel.insertMany(sampleData)
  .then((docs) => {
    console.log(docs);
  })
  .catch((err) => {
    console.log(err);
  });

});


