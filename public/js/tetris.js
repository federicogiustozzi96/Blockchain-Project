const width = 250;
const height = 500;
const pixel = 25;
var x = (width / 2) - pixel;
var y = 0;
var punteggio = 0;
var record = 0;
var linee = 0;
var username = "";

// Funzione per recuperare l'username associato al wallet
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

    var schermo = [];
    for (var i = 0; i < 20; i++) {
        schermo[i] = [];
        for (var j = 0; j < 10; j++) {
            schermo[i][j] = "t";
        }
    }

    var pezzi = [
        [['g', ''], ['g', 'g'], ['', 'g']],
        [['c', 'c'], ['c', ''], ['c', '']],
        [['', 'r'], ['r', 'r'], ['r', '']],
        [['m', 'm'], ['m', 'm']],
        [['x', ''], ['x', 'x'], ['x', '']],
        [['o', 'o'], ['', 'o'], ['', 'o']],
        [['b'], ['b'], ['b'], ['b']],
        [['y', ''], ['y', 'y'], ['y', '']]
    ];

    var colors = {
        'x': '#FFDF00',
        'r': "limegreen",
        'g': "darkorange",
        'b': "mediumorchid",
        'c': "dodgerblue",
        'm': "orangered",
        'y': "cornflowerblue",
        'o': "tomato",
        't': "grey"
    };

    var schermata = document.getElementById('schermata').getContext("2d");
    var score = document.getElementById('score').getContext("2d");
    var nRan = Math.floor((Math.random() * 7) + 0);

    var pezzo = pezzi[nRan];
    var pezzoH = pezzo.length;
    var pezzoW = pezzo[0].length;

    function disegnaPunteggio() {
        score.fillStyle = "black";
        score.fillRect(0, 0, 250, 375);

        if (pezzo[0][0] != "")
            score.fillStyle = colors[pezzo[0][0]];
        else {
            if (pezzo[0][1] != "")
                score.fillStyle = colors[pezzo[0][1]];
            else
                score.fillStyle = colors[pezzo[1][0]];
        }

        score.fillRect(5, 5, 240, 370);

        score.fillStyle = "black";
        score.fillRect(0, 130, 250, 5);
        score.fillRect(0, 250, 250, 5);
        score.fillRect(0, 370, 250, 5);

        score.font = "30px Comic Sans MS";
        score.fillStyle = "white";
        score.textAlign = "center";

        score.fillText("Record: ", 125, 55);
        score.fillText(record, 125, 105);
        score.fillText("Lines: ", 125, 175);
        score.fillText(linee, 125, 225);
        score.fillText("Score: ", 125, 295);
        score.fillText(punteggio, 125, 345);
    }

    function disegnaFin() {
        for (var i = 0; i < schermo.length; i = i + 1) {
            for (var j = 0; j < schermo[0].length; j = j + 1) {
                schermata.strokeStyle = "#F0F0F5";
                schermata.fillStyle = "grey";
                schermata.fillRect(j * pixel, i * pixel, pixel, pixel);
                schermata.strokeRect(j * pixel, i * pixel, pixel, pixel);
            }
        }

        for (var i = 0; i < schermo.length; i = i + 1) {
            for (var j = 0; j < schermo[0].length; j = j + 1) {
                if (schermo[i][j] != "t") {
                    schermata.fillStyle = colors[schermo[i][j]];
                    schermata.fillRect(j * pixel, i * pixel, pixel, pixel);
                    schermata.strokeStyle = "black";
                    schermata.strokeRect(j * pixel, i * pixel, pixel, pixel);
                }
            }
        }
    }

    function hitY() {
        if (y > height - pezzoH * pixel || y < 0)
            return true;
        return false;
    }

    function disegnaPezzo(pX, pY, pH, pW) {
        for (var i = 0; i < pH; i++) {
            for (var j = 0; j < pW; j++) {
                if (pezzo[i][j] != "") {
                    schermata.fillStyle = colors[pezzo[i][j]];
                    schermata.fillRect(pX + j * pixel, pY + i * pixel, pixel, pixel);
                    schermata.strokeStyle = "black";
                    schermata.strokeRect(pX + j * pixel, pY + i * pixel, pixel, pixel);
                }
            }
        }
    }

    function ruotaDx() {
        var h = pezzo.length;
        var matrix = [];
        for (var i = 0; i < pezzo[0].length; i++) {
            matrix[i] = [];
            for (var j = 0; j < pezzo.length; j++) {
                matrix[i][j] = pezzo[h - 1 - j][i];
            }
        }

        pezzoH = matrix.length;
        pezzoW = matrix[0].length;
        return matrix;
    }

    function ruotaSx() {
        var w = pezzo[0].length;
        var matrix = [];
        for (var i = 0; i < pezzo[0].length; i++) {
            matrix[i] = [];
            for (var j = 0; j < pezzo.length; j++) {
                matrix[i][j] = pezzo[j][w - 1 - i];
            }
        }

        pezzoH = matrix.length;
        pezzoW = matrix[0].length;
        return matrix;
    }

    document.addEventListener("keydown", control);

    function control(event) {
        if (event.keyCode == 37 && (x - pixel < 0) == false && y < height - pixel * pezzoH) {
            x = x - pixel;
            if (collide())
                x = x + pixel;
        }
        if (event.keyCode == 39 && (x + pixel > width - pezzoW * pixel) == false && y < height - pixel * pezzoH) {
            x = x + pixel;
            if (collide())
                x = x - pixel;
        }

        if (event.keyCode == 40 && hitY() == false && y < height - pixel * pezzoH) {
            y = y + pixel;
            punteggio += 2;
            if (collide()) {
                y = y - pixel;
                punteggio -= 2;
            }
        }

        if (event.keyCode == 83 && hitY() == false && y < height) {
            pezzo = ruotaSx();
            if (collide())
                pezzo = ruotaDx();
        }
        if (event.keyCode == 68 && hitY() == false && y < height) {
            pezzo = ruotaDx();
            if (collide())
                pezzo = ruotaSx();
        }

        if (event.keyCode == 32) {
            while (hitY() == false) {
                if (collide() || hitY())
                    break;
                y = y + pixel;
                punteggio += 2;
            }
            y = y - pixel;
        }
    }

    function inserisciPezzo(pezzo, pezzoX, pezzoY) {
        for (var i = 0; i < pezzo.length; i++) {
            for (var j = 0; j < pezzo[0].length; j++) {
                if (pezzo[i][j] != "") {
                    schermo[(pezzoY / pixel) + i][(pezzoX / pixel) + j] = pezzo[i][j];
                }
            }
        }
    }

    function scorri(k) {
        for (var i = k; i > 0; i--) {
            for (var j = 0; j < 10; j++) {
                schermo[i][j] = schermo[i - 1][j];
            }
        }
    }

    function risolvi() {
        var b = 0;
        for (var i = 1; i < 20; i++) {
            for (var j = 0; j < 10; j++) {
                if (schermo[i][j] == "t")
                    b = 1;
            }
            if (b == 0) {
                scorri(i);
                linee = linee + 1;
                punteggio = punteggio + 300;
            }
            b = 0;
        }
    }

    function collide() {
        for (var j = 0; j < pezzoH; j++) {
            for (var i = 0; i < pezzoW; i++) {
                if (schermo[j + y / pixel][i + x / pixel] != "t" && pezzo[j][i] != "")
                    return true;
            }
        }
        return false;
    }

    function draw() {
        risolvi();
        disegnaFin();
        disegnaPunteggio();
        disegnaPezzo(x, y, pezzoH, pezzoW);

        y = y + pixel;
        punteggio = punteggio + 2;
        if (hitY() || collide()) {
            y = y - pixel;
            inserisciPezzo(pezzo, x, y);
            pezzo = pezzi[Math.floor((Math.random() * 7) + 0)];

            x = (width / 2) - pixel;
            y = 0;
            pezzoH = pezzo.length;
            pezzoW = pezzo[0].length;
            if (collide()) {
                let posizione = -1;
                let punteggioCorrente = punteggio;

                fetch("/score", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "game": "tetris", "username": username, "points": punteggioCorrente })
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
                        })
                    }
                }).catch(error => console.error('Errore:', error));
                
                if (punteggio > record)
                    record = punteggio;
                for (var i = 0; i < 20; i++) {
                    schermo[i] = [];
                    for (var j = 0; j < 10; j++) {
                        schermo[i][j] = "t";
                    }
                }
                
                punteggio = 0;
                linee = 0;
            }
        }
    }

    let game = setInterval(draw, 350);
}
