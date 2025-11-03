import style from './modalnwm.css' with { type: 'css' };

export class ModalNWM extends HTMLDialogElement
{
    #container = document.createElement('div');
    #closeButton = document.createElement('button');
    #valideButton = document.createElement('button');
    #promptInput = document.createElement('input');
    #textField = document.createElement('p');
    #modalType = null;
    #shadow = null;
    _resolveHandler = null;


    constructor()
    {
        super();
        this.#shadow = this.#container.attachShadow({ mode: 'open' });
        this.initRender();
        this.initMethods();
    }
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
    initMethods()
    {
        this._handlePromptResponse = this.#handlePromptResponse.bind(this);
        this.#closeButton.addEventListener('click', this.#handleButtonEvent.bind(this));
        this.#valideButton.addEventListener('click', this.#handleButtonEvent.bind(this));
    }
    alert(message)
    {
        this.#textField.textContent = message;
        this.#promptInput.style.display = 'none';
        this.#valideButton.style.display = 'none';
        this.#closeButton.textContent = 'Fermer';
        this.#modalType = 'alert';
        this.showModal();
    }
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
    #handlePromise(resolve)
    {
        this._resolveHandler = resolve;
    }
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

customElements.define('modal-nwm', ModalNWM, { extends: 'dialog' });