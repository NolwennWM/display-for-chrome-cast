import style from './modalnwm.css' with { type: 'css' };

/**
 * ModalNWM class extends HTMLDialogElement to create custom modal dialogs
 * Provides alert, prompt, and confirm functionalities with custom styling
 */
export class ModalNWM extends HTMLDialogElement
{
    /** @type {HTMLDivElement} Main container element for the modal */
    #container = document.createElement('div');
    
    /** @type {HTMLButtonElement} Close/cancel button element */
    #closeButton = document.createElement('button');
    
    /** @type {HTMLButtonElement} Validation/confirm button element */
    #valideButton = document.createElement('button');
    
    /** @type {HTMLInputElement} Input field for prompt dialogs */
    #promptInput = document.createElement('input');
    
    /** @type {HTMLParagraphElement} Text display element for messages */
    #textField = document.createElement('p');
    
    /** @type {string|null} Current modal type ('alert', 'prompt', 'confirm') */
    #modalType = null;
    
    /** @type {ShadowRoot|null} Shadow DOM root for encapsulation */
    #shadow = null;
    
    /** @type {Function|null} Promise resolve handler for async operations */
    _resolveHandler = null;

    /**
     * Creates a new ModalNWM instance and initializes it
     * Sets up shadow DOM, renders components, and initializes event handlers
     */
    constructor()
    {
        super();
        this.#shadow = this.#container.attachShadow({ mode: 'open' });
        this.initRender();
        this.initMethods();
    }
    
    /**
     * Initializes and renders the modal components
     * Creates DOM structure, applies styles, and sets up shadow DOM
     */
    initRender()
    {
        console.log("ModalNWM initialized");
        const styleElement = document.createElement('link');
        styleElement.rel = 'stylesheet';
        styleElement.href = './assets/js/modal-nwm/modalnwm.css';

        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');

        this.#container.classList.add('modal-nwm');
        this.#closeButton.classList.add('modal-close-button');
        this.#valideButton.classList.add('modal-valide-button');
        this.#promptInput.classList.add('modal-input');
        this.#textField.classList.add('modal-text');
            
        modalContainer.append(this.#textField, this.#promptInput, this.#valideButton, this.#closeButton);
        this.#shadow.append(styleElement, modalContainer);
        this.appendChild(this.#container);
    }
    
    /**
     * Initializes event handlers and method bindings
     * Sets up click listeners for modal buttons
     */
    initMethods()
    {
        this._handlePromptResponse = this.#handlePromptResponse.bind(this);
        this.#closeButton.addEventListener('click', this.#handleButtonEvent.bind(this));
        this.#valideButton.addEventListener('click', this.#handleButtonEvent.bind(this));
    }
    
    /**
     * Displays an alert modal with a message
     * Shows only a close button, no user input required
     * @param {string} message - Message to display in the alert
     */
    alert(message)
    {
        this.#textField.textContent = message;
        this.#promptInput.style.display = 'none';
        this.#valideButton.style.display = 'none';
        this.#closeButton.textContent = 'Fermer';
        this.#modalType = 'alert';
        this.showModal();
    }
    
    /**
     * Displays a prompt modal requesting user input
     * Returns the user input or null if cancelled
     * @param {string} message - Message to display in the prompt
     * @param {string} defaultValue - Default value for the input field
     * @returns {Promise<string|null>} User input or null if cancelled
     */
    async prompt(message, defaultValue = '')
    {
        this.#textField.textContent = message;
        this.#promptInput.style.display = 'block';
        this.#promptInput.value = defaultValue;
        this.#valideButton.style.display = 'inline-block';
        this.#valideButton.textContent = 'Valider';
        this.#closeButton.textContent = 'Annuler';
        this.#modalType = 'prompt';
        this.showModal();
        return await new Promise(this.#handlePromise.bind(this));
    }
    
    /**
     * Displays a confirmation modal with confirm/cancel options
     * Returns true if confirmed, false if cancelled
     * @param {string} message - Message to display in the confirmation
     * @returns {Promise<boolean>} True if confirmed, false if cancelled
     */
    async confirm(message)
    {
        this.#textField.textContent = message;
        this.#promptInput.style.display = 'none';
        this.#valideButton.style.display = 'inline-block';
        this.#valideButton.textContent = 'Confirmer';
        this.#closeButton.textContent = 'Annuler';
        this.#modalType = 'confirm';
        this.showModal();
        return await new Promise(this.#handlePromise.bind(this));
    }
    
    /**
     * Handles promise creation for async modal operations
     * Stores the resolve handler for later use
     * @param {Function} resolve - Promise resolve function
     * @private
     */
    #handlePromise(resolve)
    {
        this._resolveHandler = resolve;
    }
    
    /**
     * Handles response for prompt modal interactions
     * Resolves with input value or null based on button clicked
     * @param {Event} event - Click event from modal buttons
     * @private
     */
    #handlePromptResponse(event)
    {
        if(!this._resolveHandler) return;
        const isValid = event.currentTarget === this.#valideButton;
        if (isValid) {
            this._resolveHandler(this.#promptInput.value);
            return;
        }
        this._resolveHandler(null);
    }
    
    /**
     * Handles response for confirm modal interactions
     * Resolves with true or false based on button clicked
     * @param {Event} event - Click event from modal buttons
     * @private
     */
    #handleConfirmResponse(event)
    {
        if(!this._resolveHandler) return;
        const isConfirmed = event.currentTarget === this.#valideButton;
        if (isConfirmed) 
        {
            this._resolveHandler(true);
            return;
        }
        this._resolveHandler(false);
    }
    
    /**
     * Main button event handler for all modal interactions
     * Closes modal and delegates to appropriate response handler
     * @param {Event} event - Click event from modal buttons
     * @private
     */
    #handleButtonEvent(event)
    {
        event.preventDefault();
        this.close();
        console.log(this.#modalType);
        
        switch (this.#modalType) 
        {
            case 'alert':
                // Rien à faire pour une alerte
                break;
            case 'prompt':
                this.#handlePromptResponse(event);
                break;
            case 'confirm':
                this.#handleConfirmResponse(event);
                break;
            default:
                break;
        }
        this.#modalType = null;
    }
}

// Register the custom element extending HTMLDialogElement
customElements.define('modal-nwm', ModalNWM, { extends: 'dialog' });