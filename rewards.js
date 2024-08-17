//istantiate the classes
const express = require("express");
var bodyParser = require('body-parser')

const app = express();
const { reward } = require('./scripts/Backend.js')

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());

exports.action = (req,res) => {
  const points = req.body["points"]
  reward(points.toString())
  console.log(points);
}
