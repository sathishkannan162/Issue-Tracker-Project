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
      res.json(docs);
      })
      .catch(err=>{
      res.send(err);
      });

      
      
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
