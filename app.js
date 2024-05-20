//istantiate the classes
const express = require("express");
const path = require("path");
var bodyParser = require('body-parser')

const app = express();


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


// start webserver
app.listen(5000, () => {
    console.log("Server started on Port 5000")
})