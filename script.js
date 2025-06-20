class FlashcardsApp {
    constructor() {
        this.decks = [
            {
                id: 1,
                name: "Programación Básica",
                category: "programming",
                cards: [
                    { front: "¿Qué es HTML?", back: "Lenguaje de marcado para crear páginas web" },
                    { front: "¿Qué es CSS?", back: "Lenguaje para estilizar páginas web" }
                ]
            },
            {
                id: 2,
                name: "Historia Universal",
                category: "history",
                cards: [
                    { front: "¿Cuándo fue la Revolución Francesa?", back: "1789" }
                ]
            }
        ];
        
        this.currentDeck = null;
        this.currentCardIndex = 0;
        this.currentEditingDeck = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderManageDeckList();
    }

    initializeElements() {
        this.elements = {
            btnNewDeck: document.getElementById("btn-new-deck"),
            btnStudy: document.getElementById("btn-study"),
            btnManage: document.getElementById("btn-manage"),
            modalNewDeck: document.getElementById("modal-new-deck"),
            modalManageDecks: document.getElementById("modal-manage-decks"),
            deckNameInput: document.getElementById("deck-name"),
            deckCategorySelect: document.getElementById("deck-category"),
            manageDeckList: document.getElementById("manage-deck-list"),
            studyArea: document.getElementById("study-area"),
            currentDeckName: document.getElementById("current-deck-name"),
            cardFront: document.getElementById("card-front"),
            cardBack: document.getElementById("card-back"),
            cardCounter: document.getElementById("card-counter"),
            studyProgress: document.getElementById("study-progress"),
            btnPrev: document.getElementById("btn-prev"),
            btnNext: document.getElementById("btn-next"),
            btnFlip: document.getElementById("btn-flip"),
            btnCreateDeck: document.getElementById("btn-create-deck"),
            btnCancelNew: document.getElementById("btn-cancel-new"),
            btnCloseManage: document.getElementById("btn-close-manage"),
            btnCloseStudy: document.getElementById("btn-close-study")
        };
    }

    setupEventListeners() {
        this.elements.btnNewDeck.addEventListener("click", () => this.showModal("new-deck"));
        this.elements.btnStudy.addEventListener("click", () => this.showModal("choose-deck"));
        this.elements.btnManage.addEventListener("click", () => this.showManageDecks());
        this.elements.btnCreateDeck.addEventListener("click", () => this.createNewDeck());
        this.elements.btnCancelNew.addEventListener("click", () => this.closeAllModals());
        this.elements.btnCloseManage.addEventListener("click", () => this.closeAllModals());
        this.elements.btnCloseStudy.addEventListener("click", () => this.closeStudySession());
        this.elements.btnPrev.addEventListener("click", () => this.showPreviousCard());
        this.elements.btnNext.addEventListener("click", () => this.showNextCard());
        this.elements.btnFlip.addEventListener("click", () => this.flipCurrentCard());

        document.querySelectorAll(".close").forEach(btn => {
            btn.addEventListener("click", () => this.closeAllModals());
        });
    }

    createNewDeck() {
        const name = this.elements.deckNameInput.value.trim();
        const category = this.elements.deckCategorySelect.value;

        if (!name) {
            alert("Por favor ingresa un nombre para el deck");
            return;
        }

        const newDeck = {
            id: Date.now(),
            name,
            category,
            cards: []
        };

        this.decks.push(newDeck);
        this.closeAllModals();
        this.renderManageDeckList();
        this.elements.deckNameInput.value = "";
    }

    renderManageDeckList() {
        const categoryFilter = document.getElementById("manage-filter-category")?.value || "all";
        const searchTerm = document.getElementById("manage-search-deck")?.value.toLowerCase() || "";

        let filteredDecks = this.decks;

        if (categoryFilter !== "all") {
            filteredDecks = filteredDecks.filter(deck => deck.category === categoryFilter);
        }

        if (searchTerm) {
            filteredDecks = filteredDecks.filter(deck => 
                deck.name.toLowerCase().includes(searchTerm)
        }

        this.elements.manageDeckList.innerHTML = filteredDecks.map(deck => `
            <div class="deck-card">
                <h3>${deck.name}</h3>
                <div class="deck-meta">
                    <span>${this.getCategoryName(deck.category)}</span>
                    <span>${deck.cards.length} tarjetas</span>
                </div>
                <div class="deck-actions">
                    <button onclick="app.editDeckPrompt(${deck.id})" class="primary-btn">✏️ Editar</button>
                    <button onclick="app.startStudySession(${deck.id})" class="secondary-btn">📖 Estudiar</button>
                </div>
            </div>
        `).join("");
    }

    getCategoryName(categoryKey) {
        const categories = {
            programming: "Programación",
            science: "Ciencia",
            history: "Historia"
        };
        return categories[categoryKey] || "Otro";
    }

    startStudySession(deckId) {
        this.currentDeck = this.decks.find(deck => deck.id === deckId);
        this.currentCardIndex = 0;

        if (!this.currentDeck || this.currentDeck.cards.length === 0) {
            alert("Este deck no tiene tarjetas aún");
            return;
        }

        this.elements.currentDeckName.textContent = `Deck: ${this.currentDeck.name}`;
        this.updateProgress();
        this.showCurrentCard();
        this.elements.studyArea.classList.remove("hidden");
        this.closeAllModals();
    }

    showCurrentCard() {
        const card = this.currentDeck.cards[this.currentCardIndex];
        this.elements.cardFront.textContent = card.front;
        this.elements.cardBack.textContent = card.back;
        this.elements.cardCounter.textContent = `${this.currentCardIndex + 1}/${this.currentDeck.cards.length}`;
        
        const flashcard = document.querySelector(".flashcard");
        if (flashcard.classList.contains("flipped")) {
            flashcard.classList.remove("flipped");
        }
    }

    flipCurrentCard() {
        document.querySelector(".flashcard").classList.toggle("flipped");
    }

    showNextCard() {
        if (this.currentCardIndex < this.currentDeck.cards.length - 1) {
            this.currentCardIndex++;
            this.showCurrentCard();
            this.updateProgress();
        }
    }

    showPreviousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.showCurrentCard();
            this.updateProgress();
        }
    }

    updateProgress() {
        const progress = ((this.currentCardIndex + 1) / this.currentDeck.cards.length) * 100;
        this.elements.studyProgress.value = progress;
    }

    showModal(modalType) {
        this.closeAllModals();
        
        if (modalType === "new-deck") {
            this.elements.modalNewDeck.style.display = "flex";
        } else if (modalType === "manage-decks") {
            this.renderManageDeckList();
            this.elements.modalManageDecks.style.display = "flex";
        }
    }

    closeAllModals() {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.style.display = "none";
        });
    }

    closeStudySession() {
        this.elements.studyArea.classList.add("hidden");
    }

    editDeckPrompt(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        this.currentEditingDeck = deck;
        alert(`Editar deck: ${deck.name}\nEsta función está en desarrollo`);
    }

    showManageDecks() {
        this.renderManageDeckList();
        this.showModal("manage-decks");
    }
}

const app = new FlashcardsApp();

// Funciones globales para llamadas desde HTML
function editDeckPrompt(deckId) {
    app.editDeckPrompt(deckId);
}

function startStudySession(deckId) {
    app.startStudySession(deckId);
}