//istantiate the classes
const express = require("express");
const mysql = require("mysql");
const path = require("path");
var bodyParser = require('body-parser')

const app = express();
const dotenv = require("dotenv");

const { buyToken, sell, reward, buy_nft } = require('./scripts/Backend.js')

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

  // Riceve il segnale dal frontend che è stato premuto il pulsante "buy"
  app.post("/buy", function (req, res) {
    console.log(req.body) // populated!

    // Richiama la funzione "buyToken" del file "Backend.js"
    buyToken(req.body.price.toString())
   
  });

  // Riceve il segnale dal frontend che è stato premuto il pulsante "sell"
  app.post("/sell", function (req, res) {
    console.log(req.body) // populated!

    // Richiama la funzione "sell" del file "Backend.js"
    sell(req.body.price.toString())
  });

  // Riceve il segnale dal frontend che è stato inviato il risultato di un gioco
  app.post("/result", function (req, res) {
    console.log(req.body) // populated!

    // Richiama la funzione "reward" del file "Backend.js"
    reward(req.body.score.toString())
  });

  app.post("/address", function (req, res) {
    console.log(req.body) // populated!
  });
  
  // Riceve il segnale dal frontend che è stato premuto il pulsante "buyNFT"
  app.post("/nftAction", function (req, res) {
    console.log(req.body) // populated!

    // Richiama la funzione "buy_nft" del file "Backend.js"
    buy_nft(req.body.section.toString())
  });


// start webserver
app.listen(5000, () => {
    console.log("Server started on Port 5000")
})