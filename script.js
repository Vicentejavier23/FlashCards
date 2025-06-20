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
      modalEditCards: document.getElementById("modal-edit-cards"),
      modalChooseDeck: document.getElementById("modal-choose-deck"),
      modalManageDecks: document.getElementById("modal-manage-decks"),
      modalEditDeck: document.getElementById("modal-edit-deck"),

      // Formularios
      deckNameInput: document.getElementById("deck-name"),
      deckCategory
