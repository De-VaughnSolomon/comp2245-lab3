
const fruits = [
    { name: "apple", symbol: "🍎 " },
    { name: "banana", symbol: "🍌 " },
    { name: "cherry", symbol: "🍒 " },
    { name: "coconut", symbol: "🥥 " },
    { name: "grapes", symbol: "🍇 " },
    { name: "mango", symbol: "🥭 " },
    { name: "pineapple", symbol: "🍍 " },
    { name: "watermelon", symbol: "🍉 " },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const status = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");

let deck = [];
let moves = 0;
let waiting = false;
let flipTimer = null;

const flippedCards = [];

function startGame() {
    clearTimeout(flipTimer);
    flipTimer = null;

    board.replaceChildren();

    deck = shuffle([...fruits, ...fruits]);

    moves = 0;
    movesDisplay.textContent = moves;

    flippedCards.length = 0;
    waiting = false;

    status.textContent =
        "Turn over two cards to find a matching pair.";
    status.classList.remove("you-won");

    for (let i = 0; i < deck.length; i++) {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;

        board.appendChild(card);
    }
}

board.addEventListener("click", function(event) {
    const card = event.target;

    if (waiting) {
        return;
    }

    if (!card.classList.contains("card")) {
        return;
    }

    if (card.classList.contains("flipped") || card.disabled) {
        return;
    }

    const fruit = deck[card.dataset.index];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute(
        "aria-label",
        `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`
    );

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        const firstCard = flippedCards[0];
        const secondCard = flippedCards[1];

        const firstFruit = deck[firstCard.dataset.index];
        const secondFruit = deck[secondCard.dataset.index];

        if (firstFruit.name === secondFruit.name) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            firstCard.disabled = true;
            secondCard.disabled = true;

            status.textContent = "That's a pair!";

            flippedCards.length = 0;

            const matchedCards =
                board.querySelectorAll(".matched");

            if (matchedCards.length === 16) {
                status.textContent =
                    `You found all the pairs in ${moves} moves!`;
                status.classList.add("you-won");
            }
        } else {
            status.textContent = "Not a pair. Try again.";
            waiting = true;

            flipTimer = setTimeout(function() {
                for (let i = 0; i < flippedCards.length; i++) {
                    const currentCard = flippedCards[i];

                    currentCard.textContent = "";
                    currentCard.classList.remove("flipped");
                    currentCard.setAttribute(
                        "aria-label",
                        `Card ${Number(currentCard.dataset.index) + 1}, face down`
                    );
                }

                flippedCards.length = 0;
                waiting = false;
                flipTimer = null;
            }, 1000);
        }
    }
});

newGameButton.addEventListener("click", startGame);

startGame();
