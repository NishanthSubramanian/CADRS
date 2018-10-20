var express = require("express");
var app     = express();
var path    = require("path");

app.use(express.static(__dirname + '/view'));
app.get('/',function(req,res){
  res.sendFile('index.html');
});
app.listen(8000, () => {
  console.log('App listening on port 8000!')
});