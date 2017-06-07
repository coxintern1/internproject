
var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:OMSAIRAM@faith1@0.0.0.0:7474');

var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../app/dist")));
/*app.post('/ap1', function(req, res) {
  console.log("awesome")
  //console.log(req.data)
  console.log(req.body)
  console.log(req.body.description.BusinessUnit)
  console.log(req.body.description.Env)
  console.log(req.body.description.name)
  console.log(req.body.description.tagline)
});*/


app.post('/getAllProcess', function(req, res) {
    console.log("Hello");
      db.insertNode({
                    //ProcessId : req.body.ProcessId,
                    ProcessName: req.body.description.name,
                    ProcssDescription:req.body.description.tagline,
                    Department:req.body.description.BusinessUnit,
                    Owner: req.body.description.Env,
                 
                }, 'Process', function (err, result) {
                  console.log("Process with name " + result.ProcessName + " has been created.");
                });
    res.json({ message: 'Hurrah! Process has been created' });   
});

app.post('/defineProcess', function(req, res) {
      db.insertNode({
                    //ProcessId : req.body.ProcessId,
                    ProcessName: req.body.description.name,
                    ProcssDescription:req.body.description.tagline,
                    Department:req.body.description.BusinessUnit,
                    Owner: req.body.description.Env,
                 
                }, 'Process', function (err, result) {
                  console.log("Process with name " + result.ProcessName + " has been created.");
                });
    res.json({ message: 'Hurrah! Process has been created' });   
});

app.post('/creatProcessInstance', function(req, res) {
    var dateTime = new Date();
      db.insertNode({
                    ProcessName: req.body.ProcessName,
                    StartTime:dateTime,
                    EndTime: " ",
                    Status:  "Running"
                }, 'ProcessInstance', function (err, result) {
                    getProcessId(result);
                    console.log("Process Instance has been assigned to the Process");
                    res.json({ "ProcessName" : " " + result.ProcessName, "ProcessInstanceId" : " " + result._id });
                });   
});

function getProcessId(result){
    db.readNodesWithLabelsAndProperties('Process', {
        "ProcessName" : result.ProcessName
    }, function(err, node){
    if(err) throw err;
        makeRelationship(node,result);
});
}

function makeRelationship(node,result){
    var root_node_id = node[0]._id;
    var other_node_id = result._id;
    db.insertRelationship(other_node_id, root_node_id, 'INSTANCE_OF', {}, function(err, result){
    console.log(result);
    });
}


app.listen(8081,function(){
    //console.log("awesome")
    console.log("Started listening on port", 8081);
})



