
var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:Neo4j@0.0.0.0:7474');

var express = require("express");
var service = require('./service');
var path = require("path");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../app/dist")));



//This will be called from the frontend and will be used to create process node.
app.post('/defineProcess', function(req, res) {
    service.insertProcess(req,res);  
});

//This will be called from Java library to create a Process instance for the Process
app.post('/creatProcessInstance', function(req, res) {
    service.createProcessInstance(req,res);  
});

app.post('/getAllProcess', function(req, res) {
    service.getProcess(req,res);
});

//This will be called from Java library to update the status of the process instance
app.post('/stopInstance', function(req, res) {
    service.stopInstance(req,res);
});

// This is called to attach logs to the process instance
app.post('/creatLog', function(req, res) {
    service.creatLog(req,res);
});

//Port on which the pplication is listening
app.listen(8081,function(){
    console.log("Started listening on port", 8081);
})



