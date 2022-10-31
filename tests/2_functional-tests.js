const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require('../server');
const myDB = require('../database/connection');
const sampleData = require('../database/sampleIssues');
chai.use(chaiHttp);


suite("Functional Tests", function () {
  this.timeout(5000);
  let testDoc;
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
        issue_title: "Database connection error"
      })
      .then(docs=>{
      testDoc = docs;
        
      })
      .catch(err=>{
      console.log(err);
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
          assert.equal(res.body.name, "ValidationError");
          done();
        });
    });
  });


  // GET requests
  suite("TeSt GET request to /api/issues/{project} with no filter", function () {
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
  });
  suite("TeSt GET request to /api/issues/{project} with one filter", function () {
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
  });
  suite("TeSt GET request to /api/issues/{project} with multiple filters", function () {
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
  });

  // PUT requests
  suite("Test PUT - Update one filed", function () {
    test("Update open to false in a given doc in project soji", function (done) {
      chai
        .request(server)
        .put("/api/issues/soji")
        .send({
          _id: testDoc._id,
          open: false
        })
        .end(function (err, res) {
          console.log(res.body,'from first put request');
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.open, false);
          assert.equal(res.body._id, testDoc._id);
          assert.equal(res.body.issue_title, "Database connection error");
          assert.equal(res.body.project, "soji");
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
          created_by: "Kan"
        })
        .end(function (err, res) {
          console.log(res.body,'from second put request');
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body._id, testDoc._id);
          assert.equal(res.body.issue_title, "Database connection error");
          assert.equal(res.body.project, "soji");
          assert.equal(res.body.assigned_to, "Eli");
          assert.equal(res.body.created_by, "Kan");
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
          assigned_to: "Kan"
        })
        .end(function (err, res) {
          console.log(res.text,'from third put request');
          assert.equal(res.status, 200);
          assert.equal(res.text,'_id required');
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
        })
        .end(function (err, res) {
          console.log(res.text,'from third put request');
          assert.equal(res.status, 200);
          assert.equal(res.text,'_id required');
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
          _id: '635f79937f8ac56ec2e1eee7'
        })
        .end(function (err, res) {
          console.log(res.body,'from fourth put request');
          assert.equal(res.status, 200);
          assert.equal(res.body,null);
          // assert.equal(res.text,'_id required');
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
          console.log(res.body,'from first delete request');
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.open, false);
          assert.equal(res.body._id, testDoc._id);
          assert.equal(res.body.issue_title, "Database connection error");
          assert.equal(res.body.project, "soji");
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
          console.log(res.body,'from second delete request');
          assert.equal(res.status, 200);
          assert.equal(res.body,null);
          done();
        });
    });
  });

  suite("Test Delete requests with missing _id", function () {
    test("Delete issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/soji")
        .send({
        })
        .end(function (err, res) {
          console.log(res.body,'from third delete request');
          assert.equal(res.status, 200);
          assert.equal(res.body,null);
          done();
        });
    });
  });

  

  suite("Delete Sample records and test records", function () {
    test("delete test and sample records", function () {
      // delete sample data and test records
      myDB(async (IssueModel) => {
        IssueModel.deleteMany({ project: "chaiTests" })
          .then((docs) => {
            console.log("test data deleted:", docs);
          })
          .catch((err) => {
            console.log(err);
          });
          IssueModel.deleteMany({project: {$in: ["checko","soji","daph"] }})
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


