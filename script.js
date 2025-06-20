class FlashcardsApp {
  constructor() {
    // Estado de la aplicación
    this.decks = [];
    this.currentDeck = null;
    this.currentCardIndex = 0;
    this.currentEditingDeck = null;

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
      modalChooseDeck: document.getElementById("modal-choose-deck"),
      modalManageDecks: document.getElementById("modal-manage-decks"),
      modalEditDeck: document.getElementById("modal-edit-deck"),

      // Formularios
      deckNameInput: document.getElementById("deck-name"),
      deckCategorySelect: document.getElementById("deck-category"),
      editDeckName: document.getElementById("edit-deck-name"),
      editDeckCategory: document.getElementById("edit-deck-category"),

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

      // Listas
      deckList: document.getElementById("deck-list"),
      manageDeckList: document.getElementById("manage-deck-list"),

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
      btnEasy: document.getElementById("btn-easy")
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

    // Cierre de modales
    this.elements.btnCancelNew.addEventListener("click", () => this.closeAllModals());
    this.elements.btnCancelEdit.addEventListener("click", () => this.closeAllModals());
    this.elements.btnCloseChoose.addEventListener("click", () => this.closeAllModals());
    this.elements.btnCloseManage.addEventListener("click", () => this.closeAllModals());
    this.elements.btnCloseStudy.addEventListener("click", () => this.closeStudySession());

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
      this.renderDeckList();
      this.renderManageDeckList();
    }
  }

  saveDecksToLocalStorage() {
    localStorage.setItem('flashcardDecks', JSON.stringify(this.decks));
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
        <div class="deck-card" onclick="startStudySession('${deck.id}')">
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
            <button onclick="editDeckPrompt('${deck.id}')" class="primary-btn">✏️ Editar</button>
            <button onclick="startStudySession('${deck.id}')" class="secondary-btn">📖 Estudiar</button>
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
    return categories[categoryKey] || "Otro";
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
    const flashcard = document.querySelector(".flashcard");
    if (flashcard && flashcard.classList.contains("flipped")) {
      flashcard.classList.remove("flipped");
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

  flipCurrentCard() {
    const flashcard = document.querySelector(".flashcard");
    if (flashcard) {
      flashcard.classList.toggle("flipped");
    }
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
