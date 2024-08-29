var schermo = [];
var righe = 8;
var colonne = 8;

var numeroMine = 8;
var mine = []; 

var numeroCelle = 0; 

var gameOver = false;
var username = "";

// Funzione per recuperare lo username associato al wallet
async function fetchUsername() {
    const { ethereum } = window;
    if (ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length > 0) {
                const account = accounts[0];
                const response = await fetch("/verifyWallet?address=" + encodeURIComponent(account));
                if (response.ok) {
                    const data = await response.json();
                    username = data.username || "guest"; // Usa "guest" come fallback
                } else {
                    throw new Error("Server error while fetching username");
                }
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            alert("Error occurred while fetching your username.");
        }
    } else {
        alert("MetaMask is not installed.");
    }
}

window.onload = async function() {
    await fetchUsername(); // Recupera l'username al caricamento della pagina

    start();
    var reload = document.getElementById('reload');
    if (reload.addEventListener) {
        reload.addEventListener("click", function() {
            schermo = [];
            righe = 8;
            colonne = 8;
            numeroMine = 8;
            mine = []; 

            numeroCelle = 0; 
            count = 0;
            gameOver = false;
            document.getElementById("schermo").innerHTML = "";
            start();
        });
    }
}

function settaMine() {
    let mineSx = numeroMine;
    while (mineSx > 0) { 
        let i = Math.floor(Math.random() * righe);
        let j = Math.floor(Math.random() * colonne);
        let id = i.toString() + "-" + j.toString();

        if (!mine.includes(id)) {
            mine.push(id);
            mineSx -= 1;
        }
    }
}

function start() {
    settaMine();

    for (let i = 0; i < righe; i++) {
        let row = [];
        for (let j = 0; j < colonne; j++) {
            let cella = document.createElement("div");
            cella.id = i.toString() + "-" + j.toString();
            cella.addEventListener("click", clickCella);
            document.getElementById("schermo").append(cella);
            row.push(cella);
        }
        schermo.push(row);
    }

    console.log(schermo);
}

let count = 0;
function clickCella() {
    count++;
    if (gameOver || this.classList.contains("cella-click")) {
        return;
    }

    let cella = this;

    if (mine.includes(cella.id)) {
        gameOver = true;
        revealMines();
        var punteggio = count * 6;
        let posizione = -1; // Inizializza posizione con -1 per indicare che non è stata trovata
        let punteggioCorrente = punteggio; // Salva il punteggio attuale in una variabile locale

        fetch("/score", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "game": "minesweeper", "username": username, "points": punteggioCorrente })
        }).then(response => response.json()).then(data => {
            data.forEach((player, index) => {
                if (player.username === username) {
                    posizione = index + 1;
                }
            });

            if (posizione > 0) {
                alert(`You are the ${posizione}th player. You earned ${punteggioCorrente} Donuts!`);
                fetch("/rewards", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "points": punteggioCorrente })
                });
            } 
        }).catch(error => console.error('Errore:', error));

        return;
    }

    let coords = cella.id.split("-"); 
    let i = parseInt(coords[0]);
    let j = parseInt(coords[1]);
    controllaMine(i, j);
}

function revealMines() {
    for (let i = 0; i < righe; i++) {
        for (let j = 0; j < colonne; j++) {
            let cella = schermo[i][j];
            if (mine.includes(cella.id)) {
                var elem = document.createElement("img");
                elem.setAttribute("src", "img/bomb.png");
                elem.setAttribute("height", "40");
                elem.setAttribute("width", "40");
                cella.appendChild(elem);
                cella.style.backgroundColor = "red";                
            }
        }
    }
}

function controllaMine(r, c) {
    if (r < 0 || r >= righe || c < 0 || c >= colonne) {
        return;
    }
    if (schermo[r][c].classList.contains("cella-click")) {
        return;
    }

    schermo[r][c].classList.add("cella-click");
    numeroCelle += 1;

    let minaTrovata = 0;

    minaTrovata += controllaCella(r - 1, c - 1);     
    minaTrovata += controllaCella(r - 1, c);         
    minaTrovata += controllaCella(r - 1, c + 1);      

    minaTrovata += controllaCella(r, c - 1);        
    minaTrovata += controllaCella(r, c + 1);        

    minaTrovata += controllaCella(r + 1, c - 1);      
    minaTrovata += controllaCella(r + 1, c);         
    minaTrovata += controllaCella(r + 1, c + 1);      

    if (minaTrovata > 0) {
        schermo[r][c].innerText = minaTrovata;
        schermo[r][c].classList.add("x1");
    } else {
        controllaMine(r - 1, c - 1);    
        controllaMine(r - 1, c);      
        controllaMine(r - 1, c + 1);    

        controllaMine(r, c - 1);      
        controllaMine(r, c + 1);      

        controllaMine(r + 1, c - 1);    
        controllaMine(r + 1, c);      
        controllaMine(r + 1, c + 1);    
    }

    if (numeroCelle == righe * colonne - numeroMine) {
        document.getElementById("reload").innerText = "You Win!";
        gameOver = true;
    }
}

function controllaCella(r, c) {
    if (r < 0 || r >= righe || c < 0 || c >= colonne) {
        return 0;
    }
    if (mine.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
