//istantiate the classes
const express = require("express");
const router = express.Router();
const scoreController = require("../scores")
const rewardsController = require("../rewards")
const usernameController = require("../username")

// manage get request at /
router.get("/", (req,res)=> {
    res.render("index");
});

router.get('/verifyWallet',usernameController.verify)
router.post('/registerUser',usernameController.register)
router.post("/score",scoreController.register );
router.get("/score",scoreController.reveal );
router.post("/rewards",rewardsController.action );


// fix ico problems
router.get('/favicon.ico', (req, res) => {
  });

// manage get request at /example
router.get("/:id",(req,res) => {
    res.render(req.params.id);
    
})

// allow to export the router functions
module.exports =router;