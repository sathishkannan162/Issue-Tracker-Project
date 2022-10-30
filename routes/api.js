'use strict';

module.exports = function (app,IssueModel) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let query = req.query
      console.log(req.query);
      let issueFields = ["_id","issue_title","issue_text","created_on","updated_on","created_by","assigned_to","open","status_text"];
      for (var key in req.query) {
        if (!issueFields.includes(key)) {
          delete query[key];
        }
      }
      query.project = project; 
      console.log(query)
      
      
      IssueModel.find(query,{ project: 0, __v: 0})
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
      console.log('inserted', docs);
      res.send(docs);
      })
      .catch(err=>{
      res.send(err);
      });
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
