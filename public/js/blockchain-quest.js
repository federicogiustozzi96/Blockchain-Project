const checkWalletUrl = 'http://localhost:5000/verifyWallet';
let username = '';
let isWalletConnected = false;

// Funzione per ottenere l'indirizzo del wallet e recuperare lo username
const fetchUsername = async () => {
    const { ethereum } = window;

    if (!ethereum || !ethereum.isMetaMask) {
        alert("MetaMask is not installed. Please install MetaMask to proceed.");
        return;
    }

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            const walletAddress = accounts[0];
            const response = await fetch(`${checkWalletUrl}?address=${encodeURIComponent(walletAddress)}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            username = data.username;

            if (!username) {
                alert('No username associated with this wallet. Please register first.');
                return;
            }

            isWalletConnected = true;
            loadQuestion(); // Carica le domande solo dopo aver ottenuto lo username
        } else {
            alert("No accounts found. Please connect your wallet.");
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        alert('Error fetching username. Please try again later.');
    }
};

const quizData = [
    {
        question: "Question 1: What is a blockchain?",
        options: [
            "A chain of blocks containing data",
            "A centralized database",
            "A type of cryptocurrency",
            "A social network"
        ],
        correct: 0
    },
    {
        question: "Question 2: Which of these is an example of a cryptocurrency based on blockchain?",
        options: ["Bitcoin", "Euro", "PayPal", "Libra"],
        correct: 0
    },
    {
        question: "Question 3: What is the main advantage of a blockchain?",
        options: [
            "Decentralization",
            "Increased privacy",
            "Interoperability",
            "Transaction speed"
        ],
        correct: 0
    },
    {
        question: "Question 4: Who created Bitcoin?",
        options: [
            "Satoshi Nakamoto",
            "Vitalik Buterin",
            "Elon Musk",
            "Bill Gates"
        ],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
const questionElement = document.getElementById('question');
const optionsElement = document.querySelector('.options');
const nextButton = document.getElementById('nextButton');

function loadQuestion() {
    if (!isWalletConnected) {
        alert("Please connect your wallet before starting the quiz.");
        return;
    }

    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="radio" name="answer" value="${index}">${option}`;
        optionsElement.appendChild(li);
    });

    nextButton.disabled = true;
}

optionsElement.addEventListener('change', () => {
    nextButton.disabled = false;
});

nextButton.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        const answerValue = parseInt(selectedOption.value);
        if (answerValue === quizData[currentQuestionIndex].correct) {
            correctAnswers++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            if (correctAnswers === quizData.length) {
                sendResult();
            } else {
                questionElement.textContent = "You completed the quiz, but not all answers were correct.";
                optionsElement.innerHTML = '';
                nextButton.style.display = 'none';
            }
        }
    }
});

function sendResult() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/result", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ score: correctAnswers, username: username, quiz: "blockchain" }));
    
    questionElement.textContent = "Quiz completed with all correct answers! Result sent.";
    optionsElement.innerHTML = '';
    nextButton.style.display = 'none';
}

// Inizia il processo di recupero dello username e avvio del quiz
fetchUsername();
