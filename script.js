class FlashcardsApp {
    constructor() {
        this.decks = []; // Aquí almacenarás tus mazos de tarjetas
        this.currentDeck = null;
        this.currentCardIndex = 0;
        this.currentEditingDeck = null;
        
        // Elementos del DOM (asegúrate de que existan en tu HTML)
        this.elements = {
            manageDeckList: document.getElementById("manage-deck-list"),
            currentDeckName: document.getElementById("current-deck-name"),
            cardFront: document.getElementById("card-front"),
            cardBack: document.getElementById("card-back"),
            cardCounter: document.getElementById("card-counter"),
            studyProgress: document.getElementById("study-progress"),
            studyArea: document.getElementById("study-area"),
            modalNewDeck: document.getElementById("modal-new-deck"),
            modalManageDecks: document.getElementById("modal-manage-decks")
        };
    }

    renderManageDeckList(categoryFilter = "Todos") {
        const searchTerm = document.getElementById("gestionar-buscar-mazo")?.value.toLowerCase() || "";
        
        let filteredDecks = this.decks;

        if (categoryFilter !== "Todos") {
            filteredDecks = filteredDecks.filter(deck => deck.categoria === categoryFilter);
        }

        if (searchTerm) {
            filteredDecks = filteredDecks.filter(deck => 
                deck.nombre.toLowerCase().includes(searchTerm)
            );
        }

        this.elements.manageDeckList.innerHTML = filteredDecks.map(deck => `
            <div class="carta-baraja">
                <h3>${deck.nombre}</h3>
                <div class="deck-meta">
                    <span>${this.getCategoryName(deck.categoria)}</span>
                    <span>${deck.cards.length} tarjetas</span>
                </div>
                <div class="acciones-de-mazo">
                    <button onclick="editDeckPrompt(${deck.id})" class="primary-btn">✏️ Editar</button>
                    <button onclick="startStudySession(${deck.id})" class="secondary-btn">📖 Estudiar</button>
                </div>
            </div>
        `).join("");
    }

    getCategoryName(categoryKey) {
        const categories = {
            programacion: "Programación",
            ciencia: "Ciencia",
            historia: "Historia"
        };
        return categories[categoryKey] || "Otro";
    }

    startStudySession(deckId) {
        this.currentDeck = this.decks.find(deck => deck.id === deckId);
        this.currentCardIndex = 0;

        if (!this.currentDeck || this.currentDeck.cards.length === 0) {
            alert("Este mazo no tiene tarjetas aún");
            return;
        }

        this.elements.currentDeckName.textContent = `Mazo: ${this.currentDeck.nombre}`;
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
        
        const flashCard = document.querySelector(".flash-card");
        if (flashCard?.classList.contains("flipped")) {
            flashCard.classList.remove("flipped");
        }
    }

    flipCurrentCard() {
        const flashCard = document.querySelector(".flash-card");
        if (flashCard) {
            flashCard.classList.toggle("flipped");
        }
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
        if (this.elements.studyProgress) {
            this.elements.studyProgress.value = progress;
        }
    }

    showModal(modalType) {
        this.closeAllModals();
        
        if (modalType === "new-deck" && this.elements.modalNewDeck) {
            this.elements.modalNewDeck.style.display = "flex";
        } else if (modalType === "manage-decks" && this.elements.modalManageDecks) {
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
        if (this.elements.studyArea) {
            this.elements.studyArea.classList.add("hidden");
        }
    }

    editDeckPrompt(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        this.currentEditingDeck = deck;
        alert(`Editar mazo: ${deck.nombre}\nEsta función está en desarrollo`);
    }

    showManageDecks() {
        this.renderManageDeckList();
        this.showModal("manage-decks");
    }
}

// Instancia global de la aplicación
const app = new FlashcardsApp();

// Funciones globales para llamadas desde HTML
function editDeckPrompt(deckId) {
    app.editDeckPrompt(deckId);
}

function startStudySession(deckId) {
    app.startStudySession(deckId);
}

// Funciones globales para controles de tarjetas
function flipCard() {
    app.flipCurrentCard();
}

function nextCard() {
    app.showNextCard();
}

function previousCard() {
    app.showPreviousCard();
}

function closeStudySession() {
    app.closeStudySession();
}

function showManageDecks() {
    app.showManageDecks();
}
}
