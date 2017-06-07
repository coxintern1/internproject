// 'module.exports' is a node.JS specific feature, it does not work with regular JavaScript
module.exports = 
{
  // This is the function which will be called in the main file, which is server.js
  // when the function is called in the main file.
  insertProcess: function (req,res) 
  {
      db.insertNode({
          ProcessName: req.body.description.name,
          ProcssDescription:req.body.description.tagline,
          Department:req.body.description.BusinessUnit,
          Owner: req.body.description.Env,
        }, 'Process', function (err, result) {
            console.log("Process with name " + result.ProcessName + " has been created.");
        });
        res.json({ message: 'hooray! Process has been created' });   
  },

  createProcessInstance: function (req,res) 
  {
      var dateTime = new Date();
      db.insertNode({
          ProcessName: req.body.ProcessName,
          StartTime:dateTime,
          EndTime: " ",
          Status:  "Running"
        }, 'ProcessInstance', function (err, result) {
            getProcessId(result);
            console.log("Process Instance has been assigned to the Process");
            res.json({ "ProcessInstanceId" : " " + result._id });
      }); 
  },

  stopInstance: function (req,res) 
  {
      var dateTime = new Date();
      db.cypherQuery('MATCH (n) where ID(n) = ' + req.body.ProcessInstanceId + ' SET n.Status = "Completed" return n', function (err, result) {
        console.log(result);
      });
      db.cypherQuery('MATCH (n) where ID(n) = ' + req.body.ProcessInstanceId + ' SET n.EndTime = "' + dateTime + '" return n', function (err, result) {
        console.log(result);
      });
      res.json({ message: 'ProcessInstance has stopped and updated with the logs.' });
  },

  getProcess: function (req,res) 
  {
      db.cypherQuery('MATCH (n:Process) return n', function (err, result) {
      res.json(result.data);
      });
  },

  creatLog: function (req,res) 
  {
      var dateTime = new Date();
      db.insertNode({
          ProcessInstanceId : req.body.ProcessInstanceId,
          LogDescription: req.body.LogDescription,
          time:req.body.dateTime
        }, 'Log', function (err, result) {
            makeRelationshipInstanceLog(result);
            console.log("Log for current Process Instance has been generated");
        });
        res.json({ message: 'hooray! Log has been created' });
  }
};

function makeRelationshipInstanceLog(result){
    console.log(result.ProcessInstanceId);
    var root_node_id = result.ProcessInstanceId;
    var other_node_id = result._id;
    db.insertRelationship(other_node_id, root_node_id, 'LOGS_OF', {}, function(err, result){
        console.log(result);
    });
}

function getProcessId(result){
    db.readNodesWithLabelsAndProperties('Process', {
        "ProcessName" : result.ProcessName
    }, function(err, node){
    if(err) throw err;
        makeRelationshipProcessInstance(node,result);
});
}

function makeRelationshipProcessInstance(node,result){
    var root_node_id = node[0]._id;
    var other_node_id = result._id;
    db.insertRelationship(other_node_id, root_node_id, 'INSTANCE_OF', {}, function(err, result){
        console.log(result);
    });
}