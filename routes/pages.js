//istantiate the classes
const express = require("express");
const router = express.Router();

// manage get request at /
router.get("/", (req,res)=> {
    res.render("index");
});

// fix ico problems
router.get('/favicon.ico', (req, res) => {
  });
  

// manage get request at /example
router.get("/:id",(req,res) => {
    res.render(req.params.id);
    
})

// allow to export the router functions
module.exports =router;