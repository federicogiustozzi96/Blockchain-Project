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

exports.register = (req,res) => {
    
    const username = req.body["username"]
    const game = req.body["game"]
    const points = req.body["points"]
    
    
    db.query("SELECT username,tetris,snake,minesweeper FROM Scores WHERE username = ?", [username], (error, results)=> {
        if (error) {
            console.error(error);
            res.status(500).send("Database query error");
        }
        if(results.length >0)
        {
            
            if(results[0][game]<points)
            {

                db.query(`UPDATE Scores SET ${game} = ? WHERE username=?`, [points,username], (error, results) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send("Database query error");
                    }
                    
                })
            }
        }
        else {
            db.query(`INSERT INTO Scores (username, ${game}) VALUES (?,?)`,[username,points], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send("Database query error");
                }
            })
        }
        
        
    })
        
    
}

exports.reveal = (req,res) => {
    db.query("SELECT * FROM Scores ORDER BY total DESC",(error,results) => {
        if (error) {
            console.error(error);
            res.status(500).send("Database query error");
        }
        else
        {
        res.render("score",{scores: results});
        }
    });
}