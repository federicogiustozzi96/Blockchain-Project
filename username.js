
const express = require("express")
const mysql = require("mysql");
const app = express();
app.use(express.json())
const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST, 
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    })

exports.verify = (req,res) =>  {
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
  }


exports.register = (req,res) =>  {
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
  }
  