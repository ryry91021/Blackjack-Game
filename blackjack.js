
let Winner;

const suits = ['C', 'S', 'H', 'D'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let user_hand = [];
let computer_hand = [];
let playing = false;

const outputElement = document.getElementById('gameOutput');
const startButton = document.querySelector('#game-container button');
const hitButton = document.getElementById('hit');
const stayButton = document.getElementById('stay');
const playAgainButton = document.getElementById('play-again');



function createCardImageElement(card) {
    const img = document.createElement('img');
    const decodedCard = decodeURIComponent(card);
    img.src = `cardimages/${decodedCard}.png`;
    img.alt = decodedCard;
    return img;
}


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function playAgain() {
    playing = false;
    playAgainButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
}

function deal(hand) {
    if (!deck.length) {
        console.log("Deck is empty. Reshuffling cards.");
        deck = shuffle([...suits.flatMap(suit => ranks.map(rank => rank + suit))]);
    }
    const card = deck.pop();
    hand.push(card);
}

function determineValue(hand) {
    let value = 0;
    let numAces = 0;

    for (const card of hand) {
        const rank = card.substring(0, card.length - 1);

        if (rank === 'A') {
            value += 11;
            numAces++;
        } else if (['K', 'Q', 'J'].includes(rank)) {
            value += 10;
        } else {
            value += parseInt(rank);
        }
    }

    while (numAces > 0 && value > 21) {
        value -= 10;
        numAces--;
    }

    return value;
}

function checkBlackjack(hand) {
    return hand.length === 2 && determineValue(hand) === 21;
}

function handlePlayerTurn(move) {
    if (move === 'H') {
        deal(user_hand);
        outputElement.innerHTML += '<p>Your hand is: ';
        user_hand.forEach(card => outputElement.appendChild(createCardImageElement(card)));
        outputElement.innerHTML += ` : ${determineValue(user_hand)}</p>`;
        if (determineValue(user_hand) > 21) {
            outputElement.innerHTML += "<p>Busted! Your hand is over 21. You lose.</p>";
            Winner = false;
            endGame();
        } else if (determineValue(user_hand) === 21) {
            outputElement.innerHTML += "<p>You won!</p>";
            Winner = true;
            endGame();
        }
    } else if (move === 'S') {
        handleDealerTurn();
    }
}

function handleDealerTurn() {
    while (determineValue(computer_hand) < 17) {
        deal(computer_hand);
    }

    outputElement.innerHTML += '<p>Dealer\'s hand is: ';
    computer_hand.forEach(card => outputElement.appendChild(createCardImageElement(card)));
    outputElement.innerHTML += ` : ${determineValue(computer_hand)}</p>`;

    if (determineValue(computer_hand) > 21) {
        outputElement.innerHTML += `<p>Dealer busted! You win!</p>`;
        Winner = true;
    } else if (determineValue(user_hand) > 21) {
        outputElement.innerHTML += "<p>You busted! Dealer wins!</p>";
        Winner = false;
    } else if (determineValue(user_hand) > determineValue(computer_hand)) {
        outputElement.innerHTML += "<p>You win!</p>";
        Winner = true;
    } else if (determineValue(user_hand) < determineValue(computer_hand)) {
        outputElement.innerHTML += "<p>Dealer wins!</p>";
        Winner = false;
    } else {
        outputElement.innerHTML += "<p>It's a tie!</p>";
    }

    outputElement.innerHTML += `<p>${Winner ? "Congratulations, you won!" : "Sorry, you lost."}</p>`;
    endGame();
}

function endGame() {
    playing = false;
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    playAgainButton.style.display = 'inline-block';
}

function startGame() {
    console.log("Starting the game...");
    deck = shuffle([...suits.flatMap(suit => ranks.map(rank => rank + suit))]);

    user_hand = [];
    computer_hand = [];
    deal(user_hand);
    deal(user_hand);
    deal(computer_hand);
    deal(computer_hand);

    // Clear the content of the gameOutput div
    outputElement.innerHTML = '';

    // Display the new hand
    outputElement.innerHTML += '<p>Your hand is: ';
    user_hand.forEach(card => outputElement.appendChild(createCardImageElement(card)));
    outputElement.innerHTML += ` : ${determineValue(user_hand)}</p>`;

    outputElement.innerHTML += `<p>Dealer's face-up card is: `;
    outputElement.appendChild(createCardImageElement(computer_hand[0]));
    outputElement.innerHTML += `</p>`;

    playing = true;
    hitButton.style.display = 'inline-block';
    stayButton.style.display = 'inline-block';
    startButton.style.display = 'none';
    playAgainButton.style.display = 'none';
}


function hit() {
    if (playing) {
        handlePlayerTurn('H');
    }
}

function stay() {
    if (playing) {
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
        handlePlayerTurn('S');
    }
}

