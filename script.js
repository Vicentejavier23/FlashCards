// Sample initial data
let decks = [
    {
        id: 1,
        name: "Hola",
        category: "general",
        cards: [
            { question: "¿Qué significa 'Hola' en inglés?", answer: "Hello" },
            { question: "¿Cómo se dice 'gracias' en inglés?", answer: "Thank you" },
            { question: "¿Qué significa 'adiós' en inglés?", answer: "Goodbye" }
        ]
    },
    {
        id: 2,
        name: "Hhh",
        category: "general",
        cards: [
            { question: "Pregunta de ejemplo", answer: "Respuesta de ejemplo" }
        ]
    }
];

// DOM elements
const mainView = document.getElementById('main-view');
const manageView = document.getElementById('manage-view');
const studyView = document.getElementById('study-view');
const decksContainer = document.getElementById('decks-container');
const manageDecksContainer = document.getElementById('manage-decks-container');
const manageBtn = document.getElementById('manage-btn');
const backBtn = document.getElementById('back-btn');
const addDeckBtn = document.getElementById('add-deck-btn');
const endStudyBtn = document.getElementById('end-study-btn');
const currentDeckName = document.getElementById('current-deck-name');
const flashcard = document.getElementById('flashcard');
const cardContent = document.getElementById('card-content');
const prevCardBtn = document.getElementById('prev-card');
const nextCardBtn = document.getElementById('next-card');
const cardCounter = document.getElementById('card-counter');
const deckModal = document.getElementById('deck-modal');
const modalTitle = document.getElementById('modal-title');
const deckNameInput = document.getElementById('deck-name');
const deckCategoryInput = document.getElementById('deck-category');
const cardsContainer = document.getElementById('cards-container');
const addCardBtn = document.getElementById('add-card-btn');
const saveDeckBtn = document.getElementById('save-deck-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');

// App state variables
let currentDeck = null;
let currentCardIndex = 0;
let showingAnswer = false;
let isEditingDeck = false;
let currentDeckId = null;

// Initialize the app
function init() {
    renderDecks();
    setupEventListeners();
    // Load decks from localStorage if available
    const savedDecks = localStorage.getItem('flashcardDecks');
    if (savedDecks) {
        decks = JSON.parse(savedDecks);
        renderDecks();
    }
}

// Set up event listeners
function setupEventListeners() {
    manageBtn.addEventListener('click', showManageView);
    backBtn.addEventListener('click', showMainView);
    addDeckBtn.addEventListener('click', () => showDeckModal(false));
    endStudyBtn.addEventListener('click', endStudy);
    flashcard.addEventListener('click', toggleCard);
    prevCardBtn.addEventListener('click', showPreviousCard);
    nextCardBtn.addEventListener('click', showNextCard);
    addCardBtn.addEventListener('click', addCardToForm);
    saveDeckBtn.addEventListener('click', saveDeck);
    cancelModalBtn.addEventListener('click', closeModal);
}

// Render decks in main view
function renderDecks() {
    decksContainer.innerHTML = '';
    
    if (decks.length === 0) {
        decksContainer.innerHTML = '<p>No hay decks disponibles. Crea uno en la vista de gestión.</p>';
        return;
    }

    decks.forEach(deck => {
        const deckElement = document.createElement('div');
        deckElement.className = 'deck';
        deckElement.innerHTML = `
            <div class="deck-header">
                <h2>${deck.name}</h2>
                <span class="card-counter">${deck.cards.length} tarjeta${deck.cards.length !== 1 ? 's' : ''}</span>
            </div>
            <p><em>${deck.category}</em></p>
            <button class="study-btn" data-deck-id="${deck.id}">Estudiar (${deck.cards.length})</button>
        `;
        decksContainer.appendChild(deckElement);
        
        deckElement.querySelector('.study-btn').addEventListener('click', () => startStudy(deck.id));
    });
}

// Render decks in manage view
function renderManageDecks() {
    manageDecksContainer.innerHTML = '';
    
    if (decks.length === 0) {
        manageDecksContainer.innerHTML = '<p>No hay decks disponibles. Añade uno nuevo.</p>';
        return;
    }

    decks.forEach(deck => {
        const deckElement = document.createElement('div');
        deckElement.className = 'deck';
        deckElement.innerHTML = `
            <div class="deck-header">
                <h2>${deck.name}</h2>
                <span class="card-counter">${deck.cards.length} tarjeta${deck.cards.length !== 1 ? 's' : ''}</span>
            </div>
            <p><em>${deck.category}</em></p>
            <div class="deck-actions">
                <button class="edit-btn" data-deck-id="${deck.id}">Editar</button>
                <button class="delete-btn" data-deck-id="${deck.id}">Eliminar</button>
            </div>
        `;
        manageDecksContainer.appendChild(deckElement);
        
        deckElement.querySelector('.edit-btn').addEventListener('click', () => showDeckModal(true, deck.id));
        deckElement.querySelector('.delete-btn').addEventListener('click', () => deleteDeck(deck.id));
    });
}

// Show deck modal for add/edit
function showDeckModal(isEdit, deckId = null) {
    isEditingDeck = isEdit;
    currentDeckId = deckId;
    
    if (isEdit && deckId) {
        modalTitle.textContent = "Editar Deck";
        const deck = decks.find(d => d.id === deckId);
        deckNameInput.value = deck.name;
        deckCategoryInput.value = deck.category;
        renderCardsInForm(deck.cards);
    } else {
        modalTitle.textContent = "Nuevo Deck";
        deckNameInput.value = "";
        deckCategoryInput.value = "general";
        cardsContainer.innerHTML = "";
    }
    
    deckModal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    deckModal.classList.add('hidden');
}

// Render cards in the form
function renderCardsInForm(cards) {
    cardsContainer.innerHTML = '';
    cards.forEach((card, index) => {
        addCardToForm(card.question, card.answer, index);
    });
}

// Add card to form
function addCardToForm(question = "", answer = "", index = null) {
    const cardId = index !== null ? index : Date.now();
    const cardElement = document.createElement('div');
    cardElement.className = 'card-item';
    cardElement.innerHTML = `
        <div class="card-item-header">
            <h4>Tarjeta #${index !== null ? index + 1 : cardsContainer.children.length + 1}</h4>
            <button class="remove-card" data-card-id="${cardId}">×</button>
        </div>
        <div class="form-group">
            <label for="card-question-${cardId}">Pregunta:</label>
            <textarea id="card-question-${cardId}" required>${question}</textarea>
        </div>
        <div class="form-group">
            <label for="card-answer-${cardId}">Respuesta:</label>
            <textarea id="card-answer-${cardId}" required>${answer}</textarea>
        </div>
    `;
    cardsContainer.appendChild(cardElement);
    
    cardElement.querySelector('.remove-card').addEventListener('click', (e) => {
        e.target.closest('.card-item').remove();
    });
}

// Save deck (create or update)
function saveDeck() {
    const name = deckNameInput.value.trim();
    const category = deckCategoryInput.value.trim();
    
    if (!name) {
        alert('Por favor ingresa un nombre para el deck');
        return;
    }
    
    const cards = [];
    const cardElements = cardsContainer.querySelectorAll('.card-item');
    
    cardElements.forEach(cardEl => {
        const question = cardEl.querySelector('textarea:nth-of-type(1)').value.trim();
        const answer = cardEl.querySelector('textarea:nth-of-type(2)').value.trim();
        
        if (question && answer) {
            cards.push({ question, answer });
        }
    });
    
    if (cards.length === 0) {
        alert('Por favor añade al menos una tarjeta al deck');
        return;
    }
    
    if (isEditingDeck && currentDeckId) {
        // Update existing deck
        const deckIndex = decks.findIndex(d => d.id === currentDeckId);
        if (deckIndex !== -1) {
            decks[deckIndex] = {
                ...decks[deckIndex],
                name,
                category,
                cards
            };
        }
    } else {
        // Create new deck
        const newId = decks.length > 0 ? Math.max(...decks.map(d => d.id)) + 1 : 1;
        decks.push({
            id: newId,
            name,
            category,
            cards
        });
    }
    
    saveDecksToLocalStorage();
    closeModal();
    renderDecks();
    renderManageDecks();
}

// Delete deck
function deleteDeck(deckId) {
    if (confirm('¿Estás seguro de que quieres eliminar este deck?')) {
        decks = decks.filter(deck => deck.id !== deckId);
        saveDecksToLocalStorage();
        renderManageDecks();
    }
}

// Save decks to localStorage
function saveDecksToLocalStorage() {
    localStorage.setItem('flashcardDecks', JSON.stringify(decks));
}

// Show manage view
function showManageView() {
    mainView.classList.add('hidden');
    manageView.classList.remove('hidden');
    renderManageDecks();
}

// Show main view
function showMainView() {
    manageView.classList.add('hidden');
    deckModal.classList.add('hidden');
    mainView.classList.remove('hidden');
    renderDecks();
}

// Start studying a deck
function startStudy(deckId) {
    currentDeck = decks.find(deck => deck.id === deckId);
    if (!currentDeck || currentDeck.cards.length === 0) {
        alert('Este deck no tiene tarjetas para estudiar.');
        return;
    }

    mainView.classList.add('hidden');
    studyView.classList.remove('hidden');
    currentDeckName.textContent = currentDeck.name;
    currentCardIndex = 0;
    showingAnswer = false;
    updateCardDisplay();
}

// End study session
function endStudy() {
    studyView.classList.add('hidden');
    mainView.classList.remove('hidden');
    currentDeck = null;
}

// Toggle card between question and answer
function toggleCard() {
    showingAnswer = !showingAnswer;
    updateCardDisplay();
}

// Update card display based on current state
function updateCardDisplay() {
    if (!currentDeck || currentDeck.cards.length === 0) return;

    const card = currentDeck.cards[currentCardIndex];
    cardContent.textContent = showingAnswer ? card.answer : card.question;
    cardCounter.textContent = `Tarjeta ${currentCardIndex + 1} de ${currentDeck.cards.length}`;
    
    // Disable/enable navigation buttons
    prevCardBtn.disabled = currentCardIndex === 0;
    nextCardBtn.disabled = currentCardIndex === currentDeck.cards.length - 1;
}

// Show previous card
function showPreviousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showingAnswer = false;
        updateCardDisplay();
    }
}

// Show next card
function showNextCard() {
    if (currentCardIndex < currentDeck.cards.length - 1) {
        currentCardIndex++;
        showingAnswer = false;
        updateCardDisplay();
    }
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', init);