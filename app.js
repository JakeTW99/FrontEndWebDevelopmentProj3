// Flashcards Data
const flashcards = [
    { front: "HTML", back: "HyperText Markup Language" },
    { front: "CSS", back: "Cascading Style Sheets" },
    { front: "JavaScript", back: "Programming language for web interactivity" },
    { front: "API", back: "Application Programming Interface" },
    { front: "JSON", back: "JavaScript Object Notation" },
    { front: "DOM", back: "Document Object Model" },
    { front: "HTTP", back: "HyperText Transfer Protocol" },
    { front: "IP", back: "Internet Protocol" },
    { front: "URL", back: "Uniform Resource Locator" },
    { front: "DNS", back: "Domain Name System" },
    { front: "Front End", back: "Client-side development" },
    { front: "Back End", back: "Server-side development" },
    { front: "Full Stack", back: "Both front end and back end development" },
    { front: "Framework", back: "A pre-prepared software structure" },
    { front: "Library", back: "A collection of pre-written code" },
    { front: "Internet", back: "Hardware and software combined infrastructure for sharing information" },
    { front: "Web Server", back: "A server that delivers web pages to users" },
    { front: "Responsive Design", back: "Design that adapts to different screen sizes" },
    { front: "Semantic HTML", back: "Using HTML elements that describe the content they enclose" },
    { front: "Conditionals", back: "Control flow statements that allow a program to execute different blocks of code based on whether a specific condition is true or false" }
];

// Memory Cards Data
const memoryCardData = [
    { name: "Ace Of Spades", image: "assets/AceOfSpades.jpg" },
    { name: "Queen Of Hearts", image: "assets/QueenOfHearts.jpg" },
    { name: "Jack Of Clubs", image: "assets/JackOfClubs.jpg.png" },
    { name: "Ten Of Spades", image: "assets/10OfSpades.jpg" },
    { name: "Seven Of Hearts", image: "assets/7OfHearts.jpg" },
    { name: "Two Of Diamonds", image: "assets/2OfDiamonds.jpg" }
]

// Duplicate the memory cards for pairs
const memoryCards = [...memoryCardData, ...memoryCardData];

// Main Application Logic
const GameType = document.getElementById('GamesContainer');
const toggleButton = document.getElementById('modeToggle');

// Counter and Index Variables
let gotItCounter = 0;
let currentFlashcardIndex = 0;

const flashCardsContainer = document.getElementById('flashCardsContent');
const memoryCardsContainer = document.getElementById('memoryCardsContent');

// Memory Game State Variables
let isFlipped = false;
let determination = false;
let firstCard = null;
let secondCard = null;
let movesMade = 0;
let matchesMade = 0;
const totalMatches = memoryCardData.length;

// Loading Initial Mode (Flashcards)
document.addEventListener('DOMContentLoaded', () => {

    if (GameType.classList.contains('flashMode')) {
        currentFlashcardIndex = 0;
        displayFlashcard();
    }

    toggleButton.addEventListener('click', () => {
        if (GameType.classList.contains('flashMode')) {
            GameType.classList.remove('flashMode');
            GameType.classList.add('memoryMode');

            toggleButton.textContent = "Switch to Flash Cards";

            gotItCounter = 0;

            startMemoryGame();

        } else {
            GameType.classList.remove('memoryMode');
            GameType.classList.add('flashMode');
            toggleButton.textContent = "Switch to Memory Cards";

            gotItCounter = 0;

            currentFlashcardIndex = 0;
            displayFlashcard();

        }
    });
});

function displayFlashcard() {
    const flashcard = flashcards[currentFlashcardIndex];
    flashCardsContainer.innerHTML = `
    <article id="flashCardWrapper">
    <article class="cardContainer" tabindex="-1" role="group" aria-label="Flashcard: ${flashcard.front}">    
        <article class="cardInner">
            <section class="cardFront">
                <p>${flashcard.front}</p>
                <button class="flip">Flip</button>
            </section>
            <section class="cardBack">
                <p>${flashcard.back}</p>
                <button class="flip">Flip</button>
            </section>
        </article>
        <nav class="cardActions">
            <button class="gotIt" disabled>Got It!</button>
            <button class="again" disabled>Again</button>
        </nav>
    </article>
    <footer class="cardFooter">
        <p class="progress">Card ${currentFlashcardIndex + 1} of ${flashcards.length}</p>
        <p class="gotItCount">"Got It" Counter: ${gotItCounter}</p>
    </footer>
    </article>
    `;

    attachListeners();

    document.querySelector('.flip')?.focus();

}

// Disable or Enable Buttons (Used during transitions and to make sure "Got It" and "Again" are only clickable after flipping card)
function buttonsDisabled(state) {
    const buttons = document.querySelectorAll('.cardActions button');
    buttons.forEach(button => button.disabled = state);
}

function attachListeners() {

    const cardFlipDuration = 800; // Duration in milliseconds
    const cardContainer = document.querySelector('.cardContainer');
    const cardInner = document.querySelector('.cardInner');
    const flipButton = document.querySelectorAll('.flip');

    const gotItButton = document.querySelector('.gotIt');
    const againButton = document.querySelector('.again');

    const flipCard = () => {

        if (cardInner.classList.contains('flipping')) {
            return;
        }

        cardInner.classList.add('flipping');
        cardInner.classList.toggle('flipped');

        const isFlipped = cardInner.classList.contains('flipped');
        gotItButton.disabled = !isFlipped;
        againButton.disabled = !isFlipped;

        setTimeout(() => {
            cardInner.classList.remove('flipping');
        }, cardFlipDuration);
    }

    if (cardInner && flipButton) {
        flipButton.forEach(button => {
            button.addEventListener('click', flipCard);
        });
    }

    document.addEventListener('keydown', (event) => {
        if (GameType.classList.contains('flashMode')) {
            if (event.key === 'ArrowLeft' && !gotItButton.disabled) {
                event.preventDefault();
                gotItButton.click();
            } else if (event.key === 'ArrowRight' && !againButton.disabled) {
                event.preventDefault();
                againButton.click();
            }
        }
    });

    const buttonHandler = (isGotIt) => {
        buttonsDisabled(true);

        if (isGotIt) {
            gotItCounter++;
        }
        currentFlashcardIndex++;

        const proceed = () => {
            if (currentFlashcardIndex >= flashcards.length) {
                setTimeout(() => {
                    alert(`You've gone through all the flashcards. You got ${gotItCounter} out of ${flashcards.length}!`);
                    currentFlashcardIndex = 0;
                    gotItCounter = 0;

                    displayFlashcard();
                }, 100);
            } else {
                displayFlashcard();
            }
        };
        if (cardInner.classList.contains('flipped')) {
            cardInner.classList.remove('flipped');
            gotItButton.disabled = true;
            againButton.disabled = true;
            setTimeout(proceed, cardFlipDuration);
        } else {
            proceed();
        }
    };
    if (gotItButton) {
        gotItButton.addEventListener('click', () => buttonHandler(true));
    }
    if (againButton) {
        againButton.addEventListener('click', () => buttonHandler(false));
    }

}

function shuffleMemoryCards() {
    for (let i = memoryCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [memoryCards[i], memoryCards[j]] = [memoryCards[j], memoryCards[i]];
    }
}

function startMemoryGame() {

    shuffleMemoryCards(memoryCards);

    isFlipped = false;
    determination = false;
    firstCard = null;
    secondCard = null;
    movesMade = 0;
    matchesMade = 0;

    let gridHTML = `
    <article class="memoryGrid" role="grid">
    <section id="gameStatus" aria-live="polite" class="sr-only"></section>
    `;

    memoryCards.forEach((card, index) => {
        gridHTML += `
            <span class="memoryCard" cardID="${index}" data-name="${card.name}"
                tabindex="0" role="button" aria-label="Faced Down Card">
                <span class="memoryCardMatchInner">
                    <span class="memoryCardMatchFront">
                        <img src="assets/cardBack.png" alt="Card Back">
                        
                    </span>
                    <span class="memoryCardMatchBack">
                        <img src="${card.image}" alt="${card.name}">
                    </span>
                </span>
            </span>
        `;
    });

    gridHTML += '</article>';

    const counterHTML = `<p class="movesMade">Moves Made: ${movesMade}</p>`;

    memoryCardsContainer.innerHTML = gridHTML + counterHTML;

    const memoryGrid = document.querySelector('.memoryGrid');

    if (memoryGrid) {
        memoryGrid.addEventListener('click', (event) => {
            let clickedCard = event.target.closest('.memoryCard');

            if (clickedCard) {
                flipCard(clickedCard);
            }
        });

        memoryGrid.addEventListener('keydown', (event) => {
            const focusedCard = event.target.closest('.memoryCard');
            if (focusedCard && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                flipCard(focusedCard);
            }
        });

    }

}

function announceStatus(message) {
    const statusElement = document.getElementById('gameStatus');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function flipCard(cardElement) {
    if (determination || cardElement.classList.contains('matched') || cardElement.classList.contains('flipped')) return;
    if (cardElement === firstCard) return;

    cardElement.classList.add('flipped');
    cardElement.setAttribute('aria-label', `Flipped Card: ${cardElement.dataset.name}`);

    if (!isFlipped) {
        isFlipped = true;
        firstCard = cardElement;
        return;
    }

    movesMade++;
    document.querySelector('.movesMade').textContent = `Moves Made: ${movesMade}`;

    secondCard = cardElement;

    checkForMatch();
}

function checkForMatch() {

    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

// Used to handle matched cards
function disableCards() {
    determination = true;
    setTimeout(() => {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        announceStatus(`Match found: ${firstCard.dataset.name}`);

        firstCard.removeAttribute('tabindex');
        secondCard.removeAttribute('tabindex');

        matchesMade++;

        if (matchesMade === totalMatches) {
            gameOver();
        }

        resetBoard();
    }, 500);
}

// Used to handle unmatched cards
function unflipCards() {
    determination = true;

    setTimeout(() => {

        announceStatus(`No match: ${firstCard.dataset.name} and ${secondCard.dataset.name}`);

        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        firstCard.setAttribute('aria-label', 'Faced Down Card');
        secondCard.setAttribute('aria-label', 'Faced Down Card');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [isFlipped, determination] = [false, false];
    [firstCard, secondCard] = [null, null];

    document.querySelector('.memoryGrid')?.focus();
}

function gameOver() {
    setTimeout(() => {
        alert(`Congratulations! You've matched all the cards in ${movesMade} moves.`);
        announceStatus(`Congratulations! You've matched all the cards in ${movesMade} moves.`);
        startMemoryGame();
    }, 700);
}