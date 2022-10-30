const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);

  suite("Test all fields POST api/project/hello", function () {
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
        .post("/api/issues/apitest")
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
          assert.equal(res.body.project, "apitest");
          done();
        });
    });
  });

  suite("Test required fields POST api/project/hello", function () {
    test("fill required fields in FORM 1", function (done) {
      const message = {
        issue_title: "chai post required fields",
        issue_text: "making post request required fields form chai",
        created_by: "chai",
      };
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send(message)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.open, true);
          assert.equal(res.body.issue_title, message.issue_title);
          assert.equal(res.body.issue_text, message.issue_text);
          assert.equal(res.body.created_by, message.created_by);
          assert.isString(res.body._id);
          assert.equal(res.body.project, "apitest");
          done();
        });
    });
  });

  suite("Test missing required fields POST api/project/hello", function () {
    test("fill with missing required fields in FORM 1", function (done) {
      const message = {
        issue_title: "chai post with missing required fields",
        issue_text: "making post with missing required form chai",
      };
      /* if we view the res.body for this case, it contains all errors in detail, 
        we can check whether there is error in every field */
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send(message)
        .end(function (err, res) {
          assert.equal(res.body.name, "ValidationError");
          done();
        });
    });
  });
});
