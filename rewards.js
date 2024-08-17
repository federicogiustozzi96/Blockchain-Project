//istantiate the classes
const express = require("express");
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());

exports.action = (req,res) => {
  const points = req.body["points"]
  console.log(points);
}
