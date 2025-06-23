class FlashcardsApp {
    constructor() {
        this.decks = [];
        this.currentDeck = null;
        this.currentCardIndex = 0;
        this.currentEditingDeck = null;
        this.editingCardsDeck = null;
        this.editingCardIndex = null;
        this.isFlipped = false;

        this.initializeElements();
        this.setupEventListeners();
        this.loadDecksFromLocalStorage();
        this.renderDecks();
        this.showView('decks-view');
    }

    initializeElements() {
        this.elements = {
            decksView: document.getElementById('decks-view'),
            studyView: document.getElementById('study-view'),
            cardsView: document.getElementById('cards-view'),
            btnNewDeck: document.getElementById('btn-new-deck'),
            btnStudy: document.getElementById('btn-study'),
            btnManage: document.getElementById('btn-manage'),
            btnBackStudy: document.getElementById('btn-back-study'),
            btnBackCards: document.getElementById('btn-back-cards'),
            modalNewDeck: document.getElementById('modal-new-deck'),
            modalChooseDeck: document.getElementById('modal-choose-deck'),
            modalManageDecks: document.getElementById('modal-manage-decks'),
            modalEditDeck: document.getElementById('modal-edit-deck'),
            deckNameInput: document.getElementById('deck-name'),
            deckCategorySelect: document.getElementById('deck-category'),
            editDeckName: document.getElementById('edit-deck-name'),
            editDeckCategory: document.getElementById('edit-deck-category'),
            editingDeckName: document.getElementById('editing-deck-name'),
            newCardFront: document.getElementById('new-card-front'),
            newCardBack: document.getElementById('new-card-back'),
            editCardFront: document.getElementById('edit-card-front'),
            editCardBack: document.getElementById('edit-card-back'),
            btnAddCard: document.getElementById('btn-add-card'),
            btnUpdateCard: document.getElementById('btn-update-card'),
            btnCancelEditCard: document.getElementById('btn-cancel-edit-card'),
            btnSaveDeck: document.getElementById('btn-save-deck'),
            btnDeleteDeck: document.getElementById('btn-delete-deck'),
            btnSaveEditDeck: document.getElementById('btn-save-edit-deck'),
            btnShowAnswer: document.getElementById('btn-show-answer'),
            btnNextCard: document.getElementById('btn-next-card'),
            btnShowAddCardForm: document.getElementById('btn-show-add-card-form'),
            decksContainer: document.getElementById('decks-container'),
            cardsList: document.getElementById('cards-list'),
            studyDecksList: document.getElementById('study-decks-list'),
            manageDecksList: document.getElementById('manage-decks-list'),
            flashcardFront: document.querySelector('.flashcard .front'),
            flashcardBack: document.querySelector('.flashcard .back'),
            flashcardElement: document.querySelector('.flashcard'),
            closeModalButtons: document.querySelectorAll('.close-modal'),
            addCardForm: document.getElementById('add-card-form'),
            editCardForm: document.getElementById('edit-card-form')
        };
    }

    setupEventListeners() {
        // Navegación principal
        this.safeAddEventListener(this.elements.btnNewDeck, 'click', () => this.showModal('modal-new-deck'));
        this.safeAddEventListener(this.elements.btnStudy, 'click', () => this.showModal('modal-choose-deck'));
        this.safeAddEventListener(this.elements.btnManage, 'click', () => this.showManageDecksModal());
        this.safeAddEventListener(this.elements.btnBackStudy, 'click', () => this.showView('decks-view'));
        this.safeAddEventListener(this.elements.btnBackCards, 'click', () => this.showView('decks-view'));
        
        // Tarjetas
        this.safeAddEventListener(this.elements.btnAddCard, 'click', (e) => {
            e.preventDefault();
            this.addCard();
        });
        this.safeAddEventListener(this.elements.btnUpdateCard, 'click', (e) => {
            e.preventDefault();
            this.updateCard();
        });
        this.safeAddEventListener(this.elements.btnCancelEditCard, 'click', () => this.cancelEditCard());
        this.safeAddEventListener(this.elements.btnShowAddCardForm, 'click', () => this.toggleAddCardForm());
        
        // Decks
        this.safeAddEventListener(this.elements.btnSaveDeck, 'click', () => this.saveDeck());
        this.safeAddEventListener(this.elements.btnDeleteDeck, 'click', () => this.deleteDeck());
        this.safeAddEventListener(this.elements.btnSaveEditDeck, 'click', () => this.saveEditedDeck());
        
        // Estudio
        this.safeAddEventListener(this.elements.flashcardElement, 'click', () => this.flipCard());
        this.safeAddEventListener(this.elements.btnShowAnswer, 'click', () => this.flipCard());
        this.safeAddEventListener(this.elements.btnNextCard, 'click', () => this.nextCard());
        
        // Modales
        this.elements.closeModalButtons.forEach(button => {
            this.safeAddEventListener(button, 'click', () => this.closeAllModals());
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            this.safeAddEventListener(modal, 'click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
        
        // Eventos delegados para los decks
        this.safeAddEventListener(this.elements.decksContainer, 'click', (e) => {
            const deckElement = e.target.closest('.deck');
            if (!deckElement) return;
            
            if (e.target.closest('.btn-study-deck')) {
                this.startStudyingDeck(e.target.closest('.btn-study-deck').dataset.id);
            }
            if (e.target.closest('.btn-edit-deck')) {
                this.showEditDeckModal(e.target.closest('.btn-edit-deck').dataset.id);
            }
            if (e.target.closest('.btn-delete-deck')) {
                this.confirmDeleteDeck(e.target.closest('.btn-delete-deck').dataset.id);
            }
            if (e.target.closest('.btn-edit-cards')) {
                this.showCardsView(e.target.closest('.btn-edit-cards').dataset.id);
            }
        });
    }

    safeAddEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    toggleAddCardForm() {
        if (this.elements.addCardForm.style.display === 'none') {
            this.elements.addCardForm.style.display = 'block';
            this.elements.editCardForm.style.display = 'none';
            this.elements.newCardFront.focus();
        } else {
            this.elements.addCardForm.style.display = 'none';
        }
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active-view');
        });
        document.getElementById(viewId)?.classList.add('active-view');
    }

    showModal(modalId) {
        this.closeAllModals();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            if (modalId === 'modal-choose-deck') {
                this.renderStudyDecksList();
            }
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    loadDecksFromLocalStorage() {
        const savedDecks = localStorage.getItem('flashcardDecks');
        if (savedDecks) {
            this.decks = JSON.parse(savedDecks);
        }
    }

    saveDecksToLocalStorage() {
        localStorage.setItem('flashcardDecks', JSON.stringify(this.decks));
    }

    renderDecks() {
        if (!this.elements.decksContainer) return;
        this.elements.decksContainer.innerHTML = '';
        
        if (this.decks.length === 0) {
            this.elements.decksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-layer-group fa-3x"></i>
                    <h3>No tienes ningún deck aún</h3>
                    <p>Crea tu primer deck para comenzar</p>
                    <button id="btn-new-deck-empty" class="btn primary">Crear Deck</button>
                </div>
            `;
            this.safeAddEventListener(document.getElementById('btn-new-deck-empty'), 'click', () => {
                this.showModal('modal-new-deck');
            });
            return;
        }
        
        this.decks.forEach(deck => {
            const deckElement = document.createElement('div');
            deckElement.className = 'deck';
            deckElement.innerHTML = `
                <div class="deck-actions">
                    <button class="btn warning btn-edit-deck" data-id="${deck.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn primary btn-edit-cards" data-id="${deck.id}">
                        <i class="fas fa-plus"></i> Tarjetas
                    </button>
                    <button class="btn danger btn-delete-deck" data-id="${deck.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h3>${deck.name}</h3>
                <span class="deck-category">${deck.category}</span>
                <div class="deck-info">
                    <span><i class="fas fa-layer-group"></i> ${deck.cards.length} tarjetas</span>
                    <button class="btn small success btn-study-deck" data-id="${deck.id}" ${deck.cards.length === 0 ? 'disabled' : ''}>
                        Estudiar (${deck.cards.length})
                    </button>
                </div>
            `;
            this.elements.decksContainer.appendChild(deckElement);
        });
    }

    renderStudyDecksList() {
        if (!this.elements.studyDecksList) return;
        this.elements.studyDecksList.innerHTML = '';

        this.decks.forEach(deck => {
            if (deck.cards.length > 0) {
                const deckElement = document.createElement('div');
                deckElement.className = 'deck';
                deckElement.innerHTML = `
                    <h3>${deck.name}</h3>
                    <span class="deck-category">${deck.category}</span>
                    <div class="deck-info">
                        <span>${deck.cards.length} tarjetas</span>
                        <button class="btn primary btn-study-deck" data-id="${deck.id}">Estudiar (${deck.cards.length})</button>
                    </div>
                `;
                this.elements.studyDecksList.appendChild(deckElement);
            }
        });
    }

    saveDeck() {
        const name = this.elements.deckNameInput.value.trim();
        const category = this.elements.deckCategorySelect.value;

        if (!name) {
            alert('Por favor ingresa un nombre para el deck');
            return;
        }

        const newDeck = {
            id: Date.now().toString(),
            name,
            category,
            cards: []
        };

        this.decks.push(newDeck);
        this.saveDecksToLocalStorage();
        this.renderDecks();
        this.closeAllModals();
        this.elements.deckNameInput.value = '';
        this.elements.deckCategorySelect.value = 'general';
    }

    showEditDeckModal(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        this.currentEditingDeck = deck;
        this.elements.editDeckName.value = deck.name;
        this.elements.editDeckCategory.value = deck.category;
        this.showModal('modal-edit-deck');
    }

    saveEditedDeck() {
        if (!this.currentEditingDeck) return;

        const name = this.elements.editDeckName.value.trim();
        const category = this.elements.editDeckCategory.value;

        if (!name) {
            alert('Por favor ingresa un nombre para el deck');
            return;
        }

        this.currentEditingDeck.name = name;
        this.currentEditingDeck.category = category;
        this.saveDecksToLocalStorage();
        this.renderDecks();
        this.closeAllModals();
        this.currentEditingDeck = null;
    }

    confirmDeleteDeck(deckId) {
        if (confirm('¿Estás seguro de que quieres eliminar este deck? Esta acción no se puede deshacer.')) {
            this.deleteDeck(deckId);
        }
    }

    deleteDeck(deckId) {
        this.decks = this.decks.filter(deck => deck.id !== deckId);
        this.saveDecksToLocalStorage();
        this.renderDecks();
        this.closeAllModals();
    }

    showManageDecksModal() {
        this.renderManageDecksList();
        this.showModal('modal-manage-decks');
    }

    renderManageDecksList() {
        if (!this.elements.manageDecksList) return;
        this.elements.manageDecksList.innerHTML = '';

        this.decks.forEach(deck => {
            const deckElement = document.createElement('div');
            deckElement.className = 'deck';
            deckElement.innerHTML = `
                <h3>${deck.name}</h3>
                <span class="deck-category">${deck.category}</span>
                <div class="deck-info">
                    <span>${deck.cards.length} tarjetas</span>
                    <button class="btn primary btn-edit-deck" data-id="${deck.id}">Editar</button>
                    <button class="btn danger btn-delete-deck" data-id="${deck.id}">Eliminar</button>
                </div>
            `;
            this.elements.manageDecksList.appendChild(deckElement);
        });
    }

    showCardsView(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        this.editingCardsDeck = deck;
        this.elements.editingDeckName.textContent = deck.name;
        
        // Mostrar formulario de añadir y ocultar el de edición
        this.elements.addCardForm.style.display = 'block';
        this.elements.editCardForm.style.display = 'none';
        
        // Limpiar formularios
        this.elements.newCardFront.value = '';
        this.elements.newCardBack.value = '';
        this.elements.editCardFront.value = '';
        this.elements.editCardBack.value = '';
        
        this.renderCards();
        this.showView('cards-view');
    }

    renderCards() {
        if (!this.elements.cardsList || !this.editingCardsDeck) return;

        this.elements.cardsList.innerHTML = '';

        if (this.editingCardsDeck.cards.length === 0) {
            this.elements.cardsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-layer-group fa-3x"></i>
                    <h3>Este deck no tiene tarjetas aún</h3>
                    <p>Añade tu primera tarjeta para comenzar</p>
                </div>
            `;
            return;
        }

        this.editingCardsDeck.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-item';
            cardElement.innerHTML = `
                <div class="card-content">
                    <div class="card-front">${card.front}</div>
                    <div class="card-back">${card.back}</div>
                </div>
                <div class="card-actions">
                    <button class="btn warning btn-edit-card" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn danger btn-delete-card" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.elements.cardsList.appendChild(cardElement);

            // Agregar eventos a los botones de la tarjeta
            this.safeAddEventListener(
                cardElement.querySelector('.btn-edit-card'),
                'click',
                (e) => this.editCard(parseInt(e.target.closest('button').dataset.index))
            );

            this.safeAddEventListener(
                cardElement.querySelector('.btn-delete-card'),
                'click',
                (e) => this.deleteCard(parseInt(e.target.closest('button').dataset.index))
            );
        });
    }

    addCard() {
        if (!this.editingCardsDeck) return;

        const front = this.elements.newCardFront.value.trim();
        const back = this.elements.newCardBack.value.trim();

        if (!front || !back) {
            alert('Por favor completa ambos lados de la tarjeta');
            return;
        }

        this.editingCardsDeck.cards.push({ front, back });
        this.saveDecksToLocalStorage();
        this.renderCards();
        
        // Feedback visual
        const addButton = this.elements.btnAddCard;
        addButton.innerHTML = '<i class="fas fa-check"></i> Añadido!';
        addButton.classList.add('success');
        
        // Limpiar formulario
        this.elements.newCardFront.value = '';
        this.elements.newCardBack.value = '';
        this.elements.newCardFront.focus();
        
        // Restaurar botón después de 1.5 segundos
        setTimeout(() => {
            addButton.innerHTML = 'Añadir Tarjeta';
            addButton.classList.remove('success');
        }, 1500);
    }

    editCard(index) {
        if (!this.editingCardsDeck || index < 0 || index >= this.editingCardsDeck.cards.length) return;

        this.editingCardIndex = index;
        const card = this.editingCardsDeck.cards[index];

        this.elements.editCardFront.value = card.front;
        this.elements.editCardBack.value = card.back;

        this.elements.addCardForm.style.display = 'none';
        this.elements.editCardForm.style.display = 'block';
        this.elements.editCardFront.focus();
    }

    updateCard() {
        if (this.editingCardIndex === null || !this.editingCardsDeck) return;

        const front = this.elements.editCardFront.value.trim();
        const back = this.elements.editCardBack.value.trim();

        if (!front || !back) {
            alert('Por favor completa ambos lados de la tarjeta');
            return;
        }

        this.editingCardsDeck.cards[this.editingCardIndex] = { front, back };
        this.saveDecksToLocalStorage();
        this.renderCards();
        this.cancelEditCard();
        
        // Feedback visual
        const updateButton = this.elements.btnUpdateCard;
        updateButton.innerHTML = '<i class="fas fa-check"></i> Actualizado!';
        setTimeout(() => {
            updateButton.innerHTML = 'Actualizar';
        }, 1500);
    }

    cancelEditCard() {
        this.editingCardIndex = null;
        this.elements.editCardFront.value = '';
        this.elements.editCardBack.value = '';
        this.elements.addCardForm.style.display = 'block';
        this.elements.editCardForm.style.display = 'none';
        this.elements.newCardFront.focus();
    }

    deleteCard(index) {
        if (!this.editingCardsDeck || index < 0 || index >= this.editingCardsDeck.cards.length) return;

        if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
            this.editingCardsDeck.cards.splice(index, 1);
            this.saveDecksToLocalStorage();
            this.renderCards();

            if (this.editingCardIndex === index) {
                this.cancelEditCard();
            }
        }
    }

    startStudyingDeck(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck || deck.cards.length === 0) return;

        this.currentDeck = deck;
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.showCard();
        this.showView('study-view');
    }

    showCard() {
        if (!this.currentDeck || this.currentCardIndex < 0 || this.currentCardIndex >= this.currentDeck.cards.length) return;

        const card = this.currentDeck.cards[this.currentCardIndex];
        this.elements.flashcardFront.textContent = card.front;
        this.elements.flashcardBack.textContent = card.back;

        if (this.isFlipped) {
            this.elements.flashcardElement.classList.remove('flipped');
            this.isFlipped = false;
        }
    }

    flipCard() {
        this.elements.flashcardElement.classList.toggle('flipped');
        this.isFlipped = !this.isFlipped;
    }

    nextCard() {
        if (!this.currentDeck) return;

        this.currentCardIndex++;
        if (this.currentCardIndex >= this.currentDeck.cards.length) {
            this.currentCardIndex = 0;
            alert('¡Has completado todas las tarjetas! Comenzando de nuevo.');
        }

        this.showCard();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const app = new FlashcardsApp();
});