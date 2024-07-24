

var blocco = 25;
var righe = 20;
var colonne = 20;
var board;
var context; 


var posX = blocco * 5;
var posY = blocco * 5;

var direzioneX = 0;
var direzioneY = 0;

var corpo = [];


var ciboX;
var ciboY;

var record=0;
var mele=0;
var punteggio=0;

var gameOver = false;
var score;
var username=""
username=prompt("Insert your username");
window.onload = function() {
    board = document.getElementById("board");

    board.height = righe * blocco;
    board.width = colonne * blocco;
    context = board.getContext("2d"); 

    posizionaCibo();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1100/10); 

    score = document.getElementById('score').getContext("2d");
    disegnaPunteggio();


}

function update() {

    
    if (gameOver) {
        // send score to backend
        fetch("/score", { 
            method: "POST", 
            headers: { 
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ "game": "snake", "username": username, "points":punteggio }) 
        })
        alert("You earned "+punteggio/5+" Donuts!");
		gameOver=false;
		posX = blocco * 5;
		posY = blocco * 5;
		posizionaCibo();
		direzioneX = 0;
		direzioneY = 0;

		corpo = [];
		if(record < punteggio)
            record=punteggio;
        punteggio=0;
        mele=0;
        return;
    }
    

    context.fillStyle="#262F4E";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="red";
    context.fillRect(ciboX, ciboY, blocco, blocco);

    if (posX == ciboX && posY == ciboY) {
        corpo.push([ciboX, ciboY]);
        posizionaCibo();
        mele++;
        punteggio=punteggio+50
    }

    for (let i = corpo.length-1; i > 0; i--) {
        corpo[i] = corpo[i-1];
    }
    if (corpo.length) {
        corpo[0] = [posX, posY];
    }

    context.fillStyle="#00BA75";
    var preX = posX;
    var preY = posY;
    posX += direzioneX * blocco;
    posY += direzioneY * blocco;
    if(preX!= posX || preY!=posY)
    {
        punteggio++;
    }
    context.strokeStyle="black";
	context.fillRect(posX, posY, blocco, blocco);
	//context.strokeRect(posX, posY, blocco, blocco);
    for (let i = 0; i < corpo.length; i++) {
        context.fillRect(corpo[i][0], corpo[i][1], blocco, blocco);
		//context.strokeRect(corpo[i][0], corpo[i][1], blocco, blocco);
    }

    if (posX < 0 || posX > colonne*blocco-1 || posY < 0 || posY > righe*blocco) {
        gameOver = true;
    }

    for (let i = 0; i < corpo.length; i++) {
        if (posX == corpo[i][0] && posY == corpo[i][1]) {
            gameOver = true;
        }
    }
    disegnaPunteggio();
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && direzioneY != 1) {
        direzioneX = 0;
        direzioneY = -1;
    }
    else if (e.code == "ArrowDown" && direzioneY != -1) {
        direzioneX = 0;
        direzioneY = 1;
    }
    else if (e.code == "ArrowLeft" && direzioneX != 1) {
        direzioneX = -1;
        direzioneY = 0;
    }
    else if (e.code == "ArrowRight" && direzioneX != -1) {
        direzioneX = 1;
        direzioneY = 0;
    }
}


function posizionaCibo() {

    ciboX = Math.floor(Math.random() * colonne) * blocco;
    ciboY = Math.floor(Math.random() * righe) * blocco;
}

function disegnaPunteggio() 
{
    score.fillStyle="dodgerblue";
score.fillRect(0,0,250,375); 
/*
if(pezzo[0][0]!="")
    score.fillStyle=colors[pezzo[0][0]];
else
{
    if(pezzo[0][1]!="")
        score.fillStyle=colors[pezzo[0][1]];
    else
        score.fillStyle=colors[pezzo[1][0]];
}
*/
score.fillRect(5,5,240,370); 

score.fillStyle="black";
score.fillRect(0,130,250,5); 
score.fillRect(0,250,250,5);
score.fillRect(0,380,250,5); 


score.font = "30px Comic Sans MS";
score.fillStyle = "white";
score.textAlign = "center";

score.fillText("Record: ", 125,55); 
score.fillText(record, 125,105); 
score.fillText("Apples: ", 125,175); 
score.fillText(mele, 125,225);
score.fillText("Score: ", 125,295); 

score.fillText(punteggio, 125,345);
}