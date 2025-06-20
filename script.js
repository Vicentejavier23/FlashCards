class FlashcardsApp {
  constructor() {
    // Estado de la aplicación
    this.decks = [];
    this.currentDeck = null;
    this.currentCardIndex = 0;
    this.currentEditingDeck = null;
    this.editingCardsDeck = null;
    this.editingCardIndex = null;

    // Inicializar UI y event listeners
    this.initializeElements();
    this.setupEventListeners();
    this.loadDecksFromLocalStorage();
  }

  /* ==================== INICIALIZACIÓN ==================== */
  initializeElements() {
    // Elementos del DOM
    this.elements = {
      // Botones principales
      btnNewDeck: document.getElementById("btn-new-deck"),
      btnStudy: document.getElementById("btn-study"),
      btnManage: document.getElementById("btn-manage"),

      // Modales
      modalNewDeck: document.getElementById("modal-new-deck"),
      modalEditCards: document.getElementById("modal-edit-cards"),
      modalChooseDeck: document.getElementById("modal-choose-deck"),
      modalManageDecks: document.getElementById("modal-manage-decks"),
      modalEditDeck: document.getElementById("modal-edit-deck"),

      // Formularios
      deckNameInput: document.getElementById("deck-name"),
      deckCategorySelect: document.getElementById("deck-category"),
      editDeckName: document.getElementById("edit-deck-name"),
      editDeckCategory: document.getElementById("edit-deck-category"),
      editingDeckName: document.getElementById("editing-deck-name"),
      newCardFront: document.getElementById("new-card-front"),
      newCardBack: document.getElementById("new-card-back"),
      editCardFront: document.getElementById("edit-card-front"),
      editCardBack: document.getElementById("edit-card-back"),

      // Botones de acción
      btnCreateDeck: document.getElementById("btn-create-deck"),
      btnCancelNew: document.getElementById("btn-cancel-new"),
      btnAddNewDeck: document.getElementById("btn-add-new-deck"),
      btnUpdateDeck: document.getElementById("btn-update-deck"),
      btnDeleteDeck: document.getElementById("btn-delete-deck"),
      btnCancelEdit: document.getElementById("btn-cancel-edit"),
      btnCloseChoose: document.getElementById("btn-close-choose"),
      btnCloseManage: document.getElementById("btn-close-manage"),
      btnCloseStudy: document.getElementById("btn-close-study"),
      btnEditCards: document.getElementById("btn-edit-cards"),
      btnAddCard: document.getElementById("btn-add-card"),
      btnSaveCards: document.getElementById("btn-save-cards"),
      btnCancelEditCards: document.getElementById("btn-cancel-edit-cards"),
      btnUpdateCard: document.getElementById("btn-update-card"),
      btnCancelEditCard: document.getElementById("btn-cancel-edit-card"),

      // Listas
      deckList: document.getElementById("deck-list"),
      manageDeckList: document.getElementById("manage-deck-list"),
      cardsListContainer: document.getElementById("cards-list-container"),

      // Secciones
      addCardSection: document.getElementById("add-card-section"),
      editCardSection: document.getElementById("edit-card-section"),

      // Filtros
      filterCategory: document.getElementById("filter-category"),
      searchDeck: document.getElementById("search-deck"),
      manageFilterCategory: document.getElementById("manage-filter-category"),
      manageSearchDeck: document.getElementById("manage-search-deck"),

      // Área de estudio
      studyArea: document.getElementById("study-area"),
      currentDeckName: document.getElementById("current-deck-name"),
      cardFront: document.getElementById("card-front"),
      cardBack: document.getElementById("card-back"),
      cardCounter: document.getElementById("card-counter"),
      studyProgress: document.getElementById("study-progress"),
      btnPrev: document.getElementById("btn-prev"),
      btnNext: document.getElementById("btn-next"),
      btnFlip: document.getElementById("btn-flip"),
      btnDifficult: document.getElementById("btn-difficult"),
      btnEasy: document.getElementById("btn-easy"),
      flashcard: document.querySelector(".flashcard"),

      // Botones de cierre (X)
      closeButtons: document.querySelectorAll(".close")
    };
  }

  setupEventListeners() {
    // Navegación principal
    this.elements.btnNewDeck.addEventListener("click", () => this.showModal("new-deck"));
    this.elements.btnStudy.addEventListener("click", () => this.showModal("choose-deck"));
    this.elements.btnManage.addEventListener("click", () => this.showManageDecks());

    // Creación de decks
    this.elements.btnCreateDeck.addEventListener("click", () => this.createNewDeck());
    this.elements.btnAddNewDeck.addEventListener("click", () => this.showModal("new-deck"));

    // Gestión de decks
    this.elements.btnUpdateDeck.addEventListener("click", () => this.updateDeck());
    this.elements.btnDeleteDeck.addEventListener("click", () => this.confirmDeleteDeck());
    this.elements.btnEditCards.addEventListener("click", () => this.showEditCardsModal());

    // Gestión de cartas
    this.elements.btnAddCard.addEventListener("click", () => this.addNewCard());
    this.elements.btnSaveCards.addEventListener("click", () => this.saveCards());
    this.elements.btnCancelEditCards.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.editingCardIndex !== null) {
        this.showAddCardSection();
      } else {
        this.closeAllModals();
      }
    });
    this.elements.btnUpdateCard.addEventListener("click", () => this.updateCard());
    this.elements.btnCancelEditCard.addEventListener("click", (e) => {
      e.preventDefault();
      this.showAddCardSection();
    });

    // Cierre de modales
    this.elements.btnCancelNew.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeAllModals();
    });
    this.elements.btnCancelEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeAllModals();
    });
    this.elements.btnCloseChoose.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeAllModals();
    });
    this.elements.btnCloseManage.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeAllModals();
    });
    this.elements.btnCloseStudy.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeStudySession();
    });

    // Botones de cierre (X)
    this.elements.closeButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeAllModals();
      });
    });

    // Filtros
    this.elements.filterCategory.addEventListener("change", () => this.renderDeckList());
    this.elements.searchDeck.addEventListener("input", () => this.renderDeckList());
    this.elements.manageFilterCategory.addEventListener("change", () => this.renderManageDeckList());
    this.elements.manageSearchDeck.addEventListener("input", () => this.renderManageDeckList());

    // Navegación de flashcards
    this.elements.btnPrev.addEventListener("click", () => this.showPreviousCard());
    this.elements.btnNext.addEventListener("click", () => this.showNextCard());
    this.elements.btnFlip.addEventListener("click", () => this.flipCurrentCard());
    this.elements.btnDifficult.addEventListener("click", () => this.markCardAsDifficult());
    this.elements.btnEasy.addEventListener("click", () => this.markCardAsEasy());

    // Voltear tarjeta con clic o tecla espacio
    this.elements.flashcard.addEventListener("click", () => this.flipCurrentCard());
    this.elements.flashcard.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        this.flipCurrentCard();
      }
    });

    // Cierre con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeAllModals();
    });
  }

  /* ==================== LOCAL STORAGE OPERATIONS ==================== */
  loadDecksFromLocalStorage() {
    const savedDecks = localStorage.getItem('flashcardDecks');
    if (savedDecks) {
      this.decks = JSON.parse(savedDecks);
      this.updateCategoryFilters();
      this.renderDeckList();
      this.renderManageDeckList();
    }
  }

  saveDecksToLocalStorage() {
    localStorage.setItem('flashcardDecks', JSON.stringify(this.decks));
    this.updateCategoryFilters();
  }

  updateCategoryFilters() {
    // Obtener todas las categorías únicas
    const categories = new Set(this.decks.map(deck => deck.category));
    
    // Actualizar filtros en todas las secciones
    this.updateFilterOptions(this.elements.filterCategory, categories);
    this.updateFilterOptions(this.elements.manageFilterCategory, categories);
  }

  updateFilterOptions(selectElement, categories) {
    // Guardar el valor seleccionado actual
    const currentValue = selectElement.value;
    
    // Limpiar opciones existentes (excepto "Todas")
    while (selectElement.options.length > 1) {
      selectElement.remove(1);
    }
    
    // Añadir las categorías únicas
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = this.getCategoryName(category);
      selectElement.appendChild(option);
    });
    
    // Restaurar el valor seleccionado si todavía existe
    if (Array.from(selectElement.options).some(opt => opt.value === currentValue)) {
      selectElement.value = currentValue;
    }
  }

  /* ==================== DECK MANAGEMENT ==================== */
  createNewDeck() {
    const name = this.elements.deckNameInput.value.trim();
    const category = this.elements.deckCategorySelect.value;

    if (!name) {
      alert("Por favor ingresa un nombre para el deck");
      return;
    }

    const newDeck = {
      id: Date.now().toString(),
      name,
      category,
      cards: [],
      createdAt: new Date().toISOString()
    };

    this.decks.push(newDeck);
    this.saveDecksToLocalStorage();
    this.closeAllModals();
    this.renderManageDeckList();
    this.elements.deckNameInput.value = "";
  }

  updateDeck() {
    const newName = this.elements.editDeckName.value.trim();
    const newCategory = this.elements.editDeckCategory.value;

    if (!newName) {
      alert("El nombre no puede estar vacío");
      return;
    }

    this.currentEditingDeck.name = newName;
    this.currentEditingDeck.category = newCategory;
    this.saveDecksToLocalStorage();
    this.renderManageDeckList();
    this.closeAllModals();
  }

  confirmDeleteDeck() {
    if (confirm("¿Estás seguro de eliminar este deck? Esta acción no se puede deshacer.")) {
      this.decks = this.decks.filter(deck => deck.id !== this.currentEditingDeck.id);
      this.saveDecksToLocalStorage();
      this.renderManageDeckList();
      this.closeAllModals();
    }
  }

  /* ==================== CARD MANAGEMENT ==================== */
  showEditCardsModal() {
    this.editingCardsDeck = {...this.currentEditingDeck}; // Copia temporal
    this.elements.editingDeckName.textContent = this.editingCardsDeck.name;
    this.renderCardsList();
    this.showAddCardSection();
    this.showModal("edit-cards");
  }

  showAddCardSection() {
    this.elements.addCardSection.style.display = "block";
    this.elements.editCardSection.style.display = "none";
    this.elements.newCardFront.value = "";
    this.elements.newCardBack.value = "";
    this.editingCardIndex = null;
    this.elements.newCardFront.focus();
  }

  showEditCardSection(index) {
    this.elements.addCardSection.style.display = "none";
    this.elements.editCardSection.style.display = "block";
    this.elements.editCardFront.value = this.editingCardsDeck.cards[index].front;
    this.elements.editCardBack.value = this.editingCardsDeck.cards[index].back;
    this.editingCardIndex = index;
    this.elements.editCardFront.focus();
  }

  renderCardsList() {
    if (!this.editingCardsDeck) return;

    this.elements.cardsListContainer.innerHTML = this.editingCardsDeck.cards
      .map((card, index) => `
        <div class="card-item" data-index="${index}">
          <p class="card-front"><strong>Pregunta:</strong> ${card.front}</p>
          <p class="card-back"><strong>Respuesta:</strong> ${card.back}</p>
          <div class="card-actions">
            <button class="edit-card" aria-label="Editar carta">✏️ Editar</button>
            <button class="delete-card" aria-label="Eliminar carta">🗑️ Eliminar</button>
          </div>
        </div>
      `).join("");

    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-card').forEach((button, index) => {
      button.addEventListener('click', (e) => {
        const cardItem = e.target.closest('.card-item');
        const index = parseInt(cardItem.dataset.index);
        this.showEditCardSection(index);
      });
    });

    document.querySelectorAll('.delete-card').forEach(button => {
      button.addEventListener('click', (e) => {
        const cardItem = e.target.closest('.card-item');
        const index = parseInt(cardItem.dataset.index);
        this.deleteCard(index);
      });
    });
  }

  addNewCard() {
    const front = this.elements.newCardFront.value.trim();
    const back = this.elements.newCardBack.value.trim();

    if (!front || !back) {
      alert("Por favor completa ambos campos (pregunta y respuesta)");
      return;
    }

    if (this.editingCardsDeck.cards.length >= 30) {
      alert("Has alcanzado el límite máximo de 30 cartas por deck");
      return;
    }

    this.editingCardsDeck.cards.push({ front, back });
    this.elements.newCardFront.value = "";
    this.elements.newCardBack.value = "";
    this.renderCardsList();
    this.elements.newCardFront.focus();
  }

  updateCard() {
    const front = this.elements.editCardFront.value.trim();
    const back = this.elements.editCardBack.value.trim();

    if (!front || !back) {
      alert("Por favor completa ambos campos (pregunta y respuesta)");
      return;
    }

    if (this.editingCardIndex !== null && this.editingCardIndex < this.editingCardsDeck.cards.length) {
      this.editingCardsDeck.cards[this.editingCardIndex] = { front, back };
      this.renderCardsList();
      this.showAddCardSection();
    }
  }

  deleteCard(index) {
    if (confirm("¿Estás seguro de eliminar esta carta?")) {
      this.editingCardsDeck.cards.splice(index, 1);
      this.renderCardsList();
      // Si estábamos editando la carta eliminada, volver a la sección de añadir
      if (this.editingCardIndex === index) {
        this.showAddCardSection();
      }
    }
  }

  saveCards() {
    // Actualizar el deck en el array principal
    const deckIndex = this.decks.findIndex(deck => deck.id === this.editingCardsDeck.id);
    if (deckIndex !== -1) {
      this.decks[deckIndex] = this.editingCardsDeck;
      this.currentEditingDeck = this.editingCardsDeck;
      this.saveDecksToLocalStorage();
    }
    this.closeAllModals();
  }

  /* ==================== DECK DISPLAY ==================== */
  renderDeckList() {
    const categoryFilter = this.elements.filterCategory.value;
    const searchTerm = this.elements.searchDeck.value.toLowerCase();

    let filteredDecks = this.decks.filter(deck => deck.cards.length > 0);

    if (categoryFilter !== "all") {
      filteredDecks = filteredDecks.filter(deck => deck.category === categoryFilter);
    }

    if (searchTerm) {
      filteredDecks = filteredDecks.filter(deck => 
        deck.name.toLowerCase().includes(searchTerm)
      );
    }

    this.elements.deckList.innerHTML = filteredDecks
      .map(deck => `
        <div class="deck-card" onclick="startStudySession('${deck.id}')" tabindex="0" role="button" aria-label="Estudiar ${deck.name}">
          <h3>${deck.name}</h3>
          <div class="deck-meta">
            <span>${this.getCategoryName(deck.category)}</span>
            <span>${deck.cards.length} tarjetas</span>
          </div>
        </div>
      `).join("");
  }

  renderManageDeckList() {
    const categoryFilter = this.elements.manageFilterCategory.value;
    const searchTerm = this.elements.manageSearchDeck.value.toLowerCase();

    let filteredDecks = this.decks;

    if (categoryFilter !== "all") {
      filteredDecks = filteredDecks.filter(deck => deck.category === categoryFilter);
    }

    if (searchTerm) {
      filteredDecks = filteredDecks.filter(deck => 
        deck.name.toLowerCase().includes(searchTerm)
      );
    }

    this.elements.manageDeckList.innerHTML = filteredDecks
      .map(deck => `
        <div class="deck-card">
          <h3>${deck.name}</h3>
          <div class="deck-meta">
            <span>${this.getCategoryName(deck.category)}</span>
            <span>${deck.cards.length} tarjetas</span>
            <span>Creado: ${new Date(deck.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="deck-actions">
            <button onclick="editDeckPrompt('${deck.id}')" class="primary-btn" aria-label="Editar ${deck.name}">✏️ Editar</button>
            <button onclick="startStudySession('${deck.id}')" class="secondary-btn" aria-label="Estudiar ${deck.name}">📖 Estudiar</button>
          </div>
        </div>
      `).join("");
  }

  getCategoryName(categoryKey) {
    const categories = {
      programming: "Programación",
      science: "Ciencia",
      history: "Historia",
      language: "Idiomas",
      other: "Otro"
    };
    return categories[categoryKey] || categoryKey; // Si no está en el mapa, devolver el valor original
  }

  /* ==================== STUDY SESSION ==================== */
  startStudySession(deckId) {
    this.currentDeck = this.decks.find(deck => deck.id === deckId);
    this.currentCardIndex = 0;

    if (!this.currentDeck || this.currentDeck.cards.length === 0) {
      alert("Este deck no tiene tarjetas aún. Agrega algunas primero.");
      return;
    }

    this.elements.currentDeckName.textContent = `Deck: ${this.currentDeck.name}`;
    this.updateProgress();
    this.showCurrentCard();
    this.elements.studyArea.classList.remove("hidden");
    this.closeAllModals();
  }

  closeStudySession() {
    this.elements.studyArea.classList.add("hidden");
  }

  showCurrentCard() {
    const card = this.currentDeck.cards[this.currentCardIndex];
    this.elements.cardFront.textContent = card.front;
    this.elements.cardBack.textContent = card.back;
    this.elements.cardCounter.textContent = `${this.currentCardIndex + 1}/${this.currentDeck.cards.length}`;

    // Resetear estado de la tarjeta
    if (this.elements.flashcard.classList.contains("flipped")) {
      this.elements.flashcard.classList.remove("flipped");
      this.elements.flashcard.setAttribute("aria-pressed", "false");
    }
  }

  showNextCard() {
    if (this.currentCardIndex < this.currentDeck.cards.length - 1) {
      this.currentCardIndex++;
      this.showCurrentCard();
      this.updateProgress();
    } else {
      alert("¡Has completado este deck!");
      this.closeStudySession();
    }
  }

  showPreviousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.showCurrentCard();
      this.updateProgress();
    }
  }

  flipCurrentCard() {
    this.elements.flashcard.classList.toggle("flipped");
    // Actualizar atributo ARIA
    const isFlipped = this.elements.flashcard.classList.contains("flipped");
    this.elements.flashcard.setAttribute("aria-pressed", isFlipped);
  }

  markCardAsDifficult() {
    // Implementar lógica de repetición espaciada
    this.showNextCard();
  }

  markCardAsEasy() {
    // Implementar lógica de repetición espaciada
    this.showNextCard();
  }

  updateProgress() {
    const progress = ((this.currentCardIndex + 1) / this.currentDeck.cards.length) * 100;
    this.elements.studyProgress.value = progress;
  }

  /* ==================== UI HELPERS ==================== */
  showModal(modalType) {
    this.closeAllModals();

    switch (modalType) {
      case "new-deck":
        this.elements.modalNewDeck.style.display = "flex";
        this.elements.deckNameInput.focus();
        break;
      case "choose-deck":
        this.renderDeckList();
        this.elements.modalChooseDeck.style.display = "flex";
        break;
      case "manage-decks":
        this.renderManageDeckList();
        this.elements.modalManageDecks.style.display = "flex";
        break;
      case "edit-deck":
        this.elements.modalEditDeck.style.display = "flex";
        this.elements.editDeckName.focus();
        break;
      case "edit-cards":
        this.elements.modalEditCards.style.display = "flex";
        this.elements.newCardFront.focus();
        break;
    }
  }

  closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.style.display = "none";
    });
  }

  showManageDecks() {
    this.renderManageDeckList();
    this.showModal("manage-decks");
  }

  editDeckPrompt(deckId) {
    const deck = this.decks.find(d => d.id === deckId);
    if (!deck) return;

    this.currentEditingDeck = deck;
    this.elements.editDeckName.value = deck.name;
    this.elements.editDeckCategory.value = deck.category;
    this.showModal("edit-deck");
  }
}

// Inicializar la aplicación
const app = new FlashcardsApp();

// Funciones globales para llamadas desde HTML
function editDeckPrompt(deckId) {
  app.editDeckPrompt(deckId);
}

function startStudySession(deckId) {
  app.startStudySession(deckId);
}
