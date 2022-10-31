const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const myDB = require("../database/connection");
const sampleData = require("../database/sampleIssues");
chai.use(chaiHttp);
require("dotenv").config;
const Browser = require("zombie/lib");
// Browser.localAddress = "0.0.0.0:8080"
Browser.localhost(
   "Issue-Tracker-Project.sathishkannan16.repl.co",
  // "example.com",
  process.env.PORT
);
// Browser.site ='0.0.0.0:8080';
let IssueModel = require("../database/issue");

suite("Functional Tests", function () {
  this.timeout(5000);
  let testDoc;
  suiteSetup(function (done) {
    // insert sample data for get query tests
    myDB(async (IssueModel) => {
      await IssueModel.insertMany(sampleData)
        .then((docs) => {
          console.log("sample data inserted:", docs);
        })
        .catch((err) => {
          console.log(err);
        });

      IssueModel.findOne({
        issue_title: "Database connection error",
      })
        .then((docs) => {
          testDoc = docs;
          done();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  // POST request
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
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  // GET requests
  suite(
    "TeSt GET request to /api/issues/{project} with no filter",
    function () {
      test("TeSt GET request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .get("/api/issues/chaiTests")
          .end(function (err, res) {
            assert.equal(res.body.length, 2);
            assert.equal(res.body[0].issue_title, "chai post all fields");
            assert.equal(res.body[1].issue_title, "chai post required fields");
            assert.equal(res.body[0].created_by, "chai");
            assert.equal(res.body[1].created_by, "chai");
            done();
          });
      });
    }
  );
  suite(
    "TeSt GET request to /api/issues/{project} with one filter",
    function () {
      test("TeSt GET request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .get("/api/issues/checko?open=false")
          .end(function (err, res) {
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].issue_title, "Fix bug in node env");
            assert.equal(res.body[0].issue_text, "node");
            assert.equal(res.body[0].created_by, "Kan");
            assert.equal(res.body[0].assigned_to, "Kan");
            assert.isFalse(res.body[0].open);
            done();
          });
      });
    }
  );
  suite(
    "TeSt GET request to /api/issues/{project} with multiple filters",
    function () {
      test("TeSt GET request with two queries", function (done) {
        chai
          .request(server)
          .get("/api/issues/checko?assigned_to=Joe&open=true")
          .end(function (err, res) {
            assert.equal(res.body.length, 2);
            assert.equal(res.body[0].issue_title, "Bug in UI");
            assert.equal(res.body[0].issue_text, "Button not working");
            assert.equal(res.body[0].assigned_to, "Joe");
            assert.equal(res.body[1].assigned_to, "Joe");
            assert.isTrue(res.body[0].open);
            assert.isTrue(res.body[1].open);
            done();
          });
      });

      test("TeSt GET request with three queries", function (done) {
        chai
          .request(server)
          .get("/api/issues/daph?assigned_to=Bale&open=false&created_by=Bale")
          .end(function (err, res) {
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].issue_title, "Fix error in function");
            assert.equal(res.body[0].assigned_to, "Bale");
            assert.equal(res.body[0].created_by, "Bale");
            assert.isFalse(res.body[0].open);
            done();
          });
      });
    }
  );

  // PUT requests
  suite("Test PUT - Update one filed", function () {
    test("Update open to false in a given doc in project soji", function (done) {
      chai
        .request(server)
        .put("/api/issues/soji")
        .send({
          _id: testDoc._id,
          open: false,
        })
        .end(function (err, res) {
          console.log(res.body, "from first put request");
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, testDoc._id);
          done();
        });
    });
  });

  suite("Test PUT - Update multiple field field filed", function () {
    test("Update assigned to and created by in a given doc in project soji", function (done) {
      chai
        .request(server)
        .put("/api/issues/soji")
        .send({
          _id: testDoc._id,
          assigned_to: "Eli",
          created_by: "Kan",
        })
        .end(function (err, res) {
          console.log(res.body, "from second put request");
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, testDoc._id);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });
  });

  suite("Test PUT - Update an Issue with missign _id field", function () {
    test("Update with missing id in project soji", function (done) {
      chai
        .request(server)
        .put("/api/issues/soji")
        .send({
          assigned_to: "Kan",
        })
        .end(function (err, res) {
          console.log(res.text, "from third put request");
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
  suite("Test PUT - Update an Issue with no field", function () {
    test("Update with no field in project soji", function (done) {
      chai
        .request(server)
        .put("/api/issues/soji")
        .send({
          _id: testDoc._id,
        })
        .end(function (err, res) {
          console.log(res.text, "from third put request");
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, testDoc._id);
          done();
        });
    });
  });

  suite("Test PUT - Update an doc with invalid _id", function () {
    test("Update with invalid _id field", function (done) {
      chai
        .request(server)
        .put("/api/issues/soji")
        .send({
          _id: "635f79937f8ac56ec2e1eee7",
          assigned_to: "Jess",
        })
        .end(function (err, res) {
          console.log(res.body, "from fourth put request");
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "635f79937f8ac56ec2e1eee7");
          done();
        });
    });
  });

  // Delete requests
  suite("Test Delete requests with valid _id", function () {
    test("Delete issue with valid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/soji")
        .send({
          _id: testDoc._id,
        })
        .end(function (err, res) {
          console.log(res.body, "from first delete request");
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, testDoc._id);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });
  });

  suite("Test Delete requests with invalid _id", function () {
    test("Delete issue with invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/soji")
        .send({
          _id: "635f84869ede51b19d8ee614",
        })
        .end(function (err, res) {
          console.log(res.body, "from second delete request");
          assert.equal(res.status, 200);
          assert.equal(res.body.error,'could not delete');
          assert.equal(res.body._id,'635f84869ede51b19d8ee614')
          done();
        });
    });
  });

  suite("Test Delete requests with missing _id", function () {
    test("Delete issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/soji")
        .send({})
        .end(function (err, res) {
          console.log(res.body, "from third delete request");
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });

  suiteTeardown(function (done) {
    // delete sample data and test records
    myDB(async (IssueModel) => {
      IssueModel.deleteMany({ project: "chaiTests" })
        .then((docs) => {
          console.log("test data deleted:", docs);
        })
        .catch((err) => {
          console.log(err);
        });
      IssueModel.deleteMany({ project: { $in: ["checko", "soji", "daph"] } })
        .then((docs) => {
          console.log("sample data deleted:", docs);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    done();
  });

  //   suite("Functional tests with zombie", function () {
  //     const browser = new Browser();
  // //    browser.site = "https://Issue-Tracker-Project.sathishkannan16.repl.co"

  //     suiteSetup(function (done) {
  //       return browser.visit("/", done);
  //     });

  //     suite("Headless browser", function () {
  //       this.timeout(5000);
  //       test('should have a working "site" property', function () {
  //         assert.isNotNull(browser.site);
  //       });
  //     });

  //     suite("Issue form at /foo", function (done) {
  //       suiteSetup(function (done) {
  //         return browser.visit("/foo", done);
  //       });

  //       test("Submit the form and check for docs", function (done) {
  //         browser.assert.text("h1#projectTitle", "All issues for: foo");
  //         browser
  //           .fill("issue_title", "test1")
  //           .then(() => {
  //             browser.fill("issue_text", "test text1");
  //           })
  //           .then(() => {
  //             browser.fill("created_by", "zombie");
  //           })
  //           .then(() => {
  //             browser.pressButton("", () => {
  //               browser.assert.success();
  //               let ids = browser.html(".id").match(/[a-f\d]{24}/g);
  //               let unique_ids = [...new Set(ids)];
  //               console.log(unique_ids);
  //               IssueModel.find({
  //                 _id: { $in: unique_ids },
  //               })
  //                 .then((docs) => {
  //                   console.log("zombie-records from web", docs);
  //                   assert.equal(docs[0].issue_title, "test1");
  //                   assert.equal(docs[1].issue_text, "test text1");
  //                   assert.equal(docs[0].open, true);
  //                   assert.equal(docs[1].created_by, "zombie");
  //                   done();
  //                 })
  //                 .catch((err) => {
  //                   console.log(err);
  //                   done();
  //                 });
  //             });
  //           });
  //       });
  //     });
  //   });
});
