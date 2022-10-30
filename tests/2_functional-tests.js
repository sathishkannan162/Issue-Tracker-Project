const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const myDB = require("../database/connection");
const sampleData = require("../database/sampleIssues");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  // insert sample data for get query tests
  myDB(async (IssueModel) => {
    await IssueModel.insertMany(sampleData)
      .then((docs) => {
        console.log("sample data inserted:", docs);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  suite("Test all fields POST api/project/chaiTests", function () {
    test("fill all fields in FORM 1", function (done) {
      const message = {
        issue_title: "chai post all fields",
        issue_text: "making post request form chai",
        created_by: "chai",
        assigned_to: "com",
        status_text: "test",
      };
      chai
        .request(server)
        .post("/api/issues/chaiTests")
        .send(message)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.open, true);
          assert.equal(res.body.issue_title, message.issue_title);
          assert.equal(res.body.issue_text, message.issue_text);
          assert.equal(res.body.created_by, message.created_by);
          assert.equal(res.body.assigned_to, message.assigned_to);
          assert.equal(res.body.status_text, message.status_text);
          assert.isString(res.body._id);
          assert.equal(res.body.project, "chaiTests");
          done();
        });
    });
  });

  suite("Test required fields POST api/project/chaiTests", function () {
    test("fill required fields in FORM 1", function (done) {
      const message = {
        issue_title: "chai post required fields",
        issue_text: "making post request required fields form chai",
        created_by: "chai",
      };
      chai
        .request(server)
        .post("/api/issues/chaiTests")
        .send(message)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.open, true);
          assert.equal(res.body.issue_title, message.issue_title);
          assert.equal(res.body.issue_text, message.issue_text);
          assert.equal(res.body.created_by, message.created_by);
          assert.isString(res.body._id);
          assert.equal(res.body.project, "chaiTests");
          done();
        });
    });
  });

  suite("Test missing required fields POST api/project/chaiTests", function () {
    test("fill with missing required fields in FORM 1", function (done) {
      const message = {
        issue_title: "chai post with missing required fields",
        issue_text: "making post with missing required form chai",
      };
      /* if we view the res.body for this case, it contains all errors in detail, 
        we can check whether there is error in every field */
      chai
        .request(server)
        .post("/api/issues/chaiTests")
        .send(message)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.name, "ValidationError");
          done();
        });
    });
  });
  suite("TeSt GET request to /api/issues/{project}", function () {
    test("TeSt GET request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .get("/api/issues/chaiTests")
        .end(function (err, res) {
          console.log(res.body);
          assert.equal(res.body.length, 2);
          assert.equal(res.body[0].issue_title, "chai post all fields");
          assert.equal(res.body[1].issue_title, "chai post required fields");
          assert.equal(res.body[0].created_by, "chai");
          assert.equal(res.body[1].created_by, "chai");
          done();
        });
    });
  });

  suite("Delete Sample records and test records", function () {
    test("delete test and sample records", async function () {
      // delete test records
      myDB(async (IssueModel) => {
        IssueModel.deleteMany({ project: "chaiTests" })
          .then((docs) => {
            console.log("test data deleted:", docs);
          })
          .catch((err) => {
            console.log(err);
          });
      });
      // delete sample data
      myDB(async (IssueModel) => {
        await IssueModel.deleteMany({project: {$in: ["checko","soji","daph"] }})
          .then((docs) => {
            console.log("sample data deleted:", docs);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  });
});


