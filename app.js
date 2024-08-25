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

    //MODIFICHE ANDREA
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  
//////////////////////////////////////////////////////////////////////////////////////////////////

// Endpoint per la verifica dell'utente
/*
app.get('/verifyWallet', (req, res) => {
  const address = req.query.address;

  // Verifica se l'indirizzo del wallet è stato passato come parametro
  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  // Query per controllare se l'indirizzo del wallet è già registrato
  db.query('SELECT username FROM Users WHERE wallet_address = ?', [address], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }

    // Verifica se l'indirizzo del wallet è presente nel database
    if (results.length > 0) {
      // Wallet trovato: restituisce il nickname associato
      res.json({ username: results[0].username });
    } else {
      // Wallet non trovato: restituisce null
      res.json({ username: null });
    }
  });
});

// Endpoint per la registrazione dell'utente
app.post('/registerUser', (req, res) => {
  const { address, username } = req.body;

  console.log("Received request:", req.body);

  // Verifica se l'username esiste già
  db.query('SELECT username FROM Users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Verifica se l'indirizzo del wallet esiste già
    db.query('SELECT wallet_address FROM Users WHERE wallet_address = ?', [address], (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
      }
      if (results.length > 0) {
        // Se l'indirizzo esiste già, restituisci un messaggio di errore
        return res.status(400).json({ error: 'Wallet address already exists' });
      }

      // Inserisci il nuovo utente
      db.query('INSERT INTO Users (wallet_address, username) VALUES (?, ?)', [address, username], (error, results) => {
        if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'An error occurred while processing your request' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});
*/
// start webserver
app.listen(5000, () => {
    console.log("Server started on Port 5000")
})