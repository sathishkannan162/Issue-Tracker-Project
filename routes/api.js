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
        console.log(`sent ${project} issues to api`);
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
      
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
