import style from './modalnwm.css' with { type: 'css' };

export class ModalNWM extends HTMLDialogElement
{
    #container = document.createElement('div');
    #closeButton = document.createElement('button');
    #valideButton = document.createElement('button');
    #promptInput = document.createElement('input');
    #textField = document.createElement('p');
    #modalType = null;
    _resolveHandler = null;


    constructor()
    {
        super();
        this.#container.attachShadow({ mode: 'open' });
        this.initRender();
    }
    initRender()
    {
        console.log("ModalNWM initialized");
        this.#container.shadowRoot.innerHTML = `
            <style>${style.toString()}</style>
        `;
        this.#container.classList.add('modal-container');
        this.#closeButton.classList.add('modal-close-button');
        this.#valideButton.classList.add('modal-valide-button');
        this.#promptInput.classList.add('modal-input');
        this.#textField.classList.add('modal-text');
        this.#container.append(this.#textField, this.#promptInput, this.#valideButton, this.#closeButton);
        this.append(this.#container);

    }
    initMethods()
    {
        this._handlePromptResponse = this._handlePromptResponse.bind(this);
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
        this.showModal();
        return await new Promise(this.#handlePromptPromise.bind(this));
    }
    #handlePromptPromise(resolve)
    {
        this._resolveHandler = resolve;
    }
    #handlePromptResponse(event)
    {
        if(!this._resolveHandler) return;
        const isValid = event.currentTarget === this.#valideButton;
        this.close();
        if (isValid) {
            this._resolveHandler(this.#promptInput.value);
            return;
        }
        this._resolveHandler(null);
    }
    #handleButtonEvent(event)
    {
        event.preventDefault();
        this.close();
        switch (this.#modalType) 
        {
            case 'alert':
                // Rien à faire pour une alerte
                break;
            case 'prompt':
                this.#handlePromptResponse(event);
                break;
            case 'confirm':
                // Rien à faire pour une confirmation
                break;
            default:
                break;
        }
        this.#modalType = null;
    }
}

customElements.define('modal-nwm', ModalNWM, { extends: 'dialog' });