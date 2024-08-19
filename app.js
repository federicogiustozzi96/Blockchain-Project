//istantiate the classes
const express = require("express");
const mysql = require("mysql");
const path = require("path");
var bodyParser = require('body-parser')

const app = express();
const dotenv = require("dotenv");

const { buyToken, sell, reward } = require('./scripts/Backend.js')

dotenv.config({path: "./.env"});


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE
})
db.connect ( (error) => {
  if(error) 
  {
    console.log(error)
  }
  else
  {
    console.log("MYSQL Connected...")
  }
  })

// mount and use public directory
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// process the json data that the app receive
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());


// use pattern view engine
app.set("view engine", "hbs");


// use the routes descripted in pages.js
app.use("/", require("./routes/pages.js"))

// manage the post requests at the /json address 
app.post("/json", function (req, res) {
    console.log(req.body) // populated!

  });

  app.post("/buy", function (req, res) {
    console.log(req.body) // populated!
    buyToken(req.body.price.toString())
   
  });

  app.post("/sell", function (req, res) {
    console.log(req.body) // populated!
    sell(req.body.price.toString())
  });

  app.post("/result", function (req, res) {
    console.log(req.body) // populated!
    reward(req.body.score.toString())
  });

// start webserver
app.listen(5000, () => {
    console.log("Server started on Port 5000")
})