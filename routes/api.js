"use strict";

module.exports = function (app, IssueModel) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let query = req.query;
      let issueFields = [
        "_id",
        "issue_title",
        "issue_text",
        "created_on",
        "updated_on",
        "created_by",
        "assigned_to",
        "open",
        "status_text",
      ];
      for (var key in req.query) {
        if (!issueFields.includes(key)) {
          delete query[key];
        }
      }
      query.project = project;
      IssueModel.find(query, { project: 0, __v: 0 })
        .then((docs) => {
          console.log(`sent project: ${project} issues to api`);
          res.json(docs);
        })
        .catch((err) => {
          res.send(err);
        });
    })

    .post(function (req, res) {
      let project = req.params.project;
      req.body.project = project;
      IssueModel.create(req.body)
        .then((docs) => {
          console.log("inserted", docs);
          res.send(docs);
        })
        .catch((err) => {
          res.json({ error: "required field(s) missing" });
        });
    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log(req.body, "from api put");
      if (req.body.hasOwnProperty("_id") && Object.keys(req.body).length == 1) {
        res.json({ error: "no update field(s) sent", _id: req.body._id });
      } else if (req.body.hasOwnProperty("_id")) {
        req.body.updated_on = new Date();
        IssueModel.findOneAndUpdate(
          {
            _id: req.body._id,
            project: project,
          },
          {
            $set: req.body,
          },
          { new: true }
        )
          .then((docs) => {
            if (docs == null) {
              res.json({ error: "could not update", _id: req.body._id });
            } else {
              res.json({ result: "successfully updated", _id: docs._id });
            }
            console.log("updated", docs);
          })
          .catch((err) => {
            console.log(err);
            res.json({ error: "could not update", _id: req.body._id });
          });
      } else {
        res.json({ error: "missing _id" });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body.hasOwnProperty('_id')) {
        res.json({error: 'missing _id'})
      }
      else {
      IssueModel.findOneAndRemove({
        _id: req.body._id,
        project: project,
      })
        .then((docs) => {
          console.log("deleted", docs);
          if (docs == null) {
            res.json({ error: "could not delete", _id: req.body._id });
          } else {
            res.json({ result: "successfully deleted", _id: req.body._id });
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({error: 'could not delete', _id:req.body._id })
        });
      }
    });

};
