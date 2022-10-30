'use strict';
let IssueModel = require('../database/issue');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      IssueModel.find({
        project: project
      },{ project: 0, __v: 0})
      .then(docs=>{
        console.log(`sent project: ${project} issues to api`);
      res.json(docs);
      })
      .catch(err=>{
      res.send(err);
      });  
    })
    
    .post(function (req, res){
      let project = req.params.project;
      req.body.project = project;
      IssueModel.create(req.body)
      .then(docs=>{
      console.log('inserted', docs)
      })
      .catch(err=>{
      console.log(err);
      });
      res.send(req.body);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      console.log(req.body);
      IssueModel.findOneAndUpdate({
        _id: req.body._id,
      },{
        $set:{
          open: req.body.open,
          updated_on: new Date()
        },
      },{new: true})
      .then(docs=>{
      console.log('found', docs);
        res.json(docs);
      })
      .catch(err=>{
      console.log(err);
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      IssueModel.findOneAndRemove({
        _id: req.body._id
      })
      .then(docs=>{
      console.log('delted',docs);
      res.json(docs);
      })
      .catch(err=>{
      console.log(err);
      res.send(err);
      });
    });
    
};
