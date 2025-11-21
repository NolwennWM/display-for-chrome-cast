/**
 * MainApp class manages the main application routing and module loading
 * Handles page navigation, dynamic module imports, and API integration
 */
class MainApp
{
    /** @type {HTMLElement} Main content container element */
    contentElement = document.querySelector('#content');
    
    /** @type {Object|null} Currently loaded page module instance */
    currentModule = null;
    
    /**
     * Creates a new MainApp instance and initializes the application
     * Sets up API handlers and loads the default dashboard page
     */
    constructor()
    {
        this.handleAppAPI();
        this.loadPage("dashboard");
    }

    /**
     * Sets up event handlers for the application API
     * Binds browser opening functionality and page navigation events
     */
     handleAppAPI()
    {
        if(!window.appAPI) return;
        if(window.appAPI.openBrowser && typeof window.appAPI.openBrowser === 'function') 
        {
            document.getElementById('openBtn')?.addEventListener('click', window.appAPI.openBrowser);
        }
        if(window.appAPI.routeTo && typeof window.appAPI.routeTo === 'function')
        {        
            document.querySelectorAll('[data-page]').forEach(element => {
                element.addEventListener('click', this.handleRouteClick.bind(this));
            });
        }
    }

    /**
     * Handles click events on navigation elements
     * Prevents default behavior and triggers page loading
     * @param {Event} event - Click event from navigation elements
     */
    handleRouteClick(event)
    {
        event.preventDefault();
        const page = event.currentTarget.getAttribute('data-page');
        if(!page) return;
        this.loadPage(page);
    }

    /**
     * Loads a specific page and its associated module
     * Fetches page content, updates DOM, and dynamically imports page module
     * @param {string} page - Page name to load (defaults to 'dashboard')
     */
    async loadPage(page = 'dashboard') 
    {
        if(!this.contentElement) return;
        const content = await window.appAPI.routeTo(page);
        this.contentElement.innerHTML = content;
        this.contentElement.className = `page-${page}`;

        const module = await import(`./${page}.js?t=${Date.now()}`);

        this.currentModule?.cleanup?.();
        this.currentModule = new module.default();

        this.handleAppAPI();
    }


}

// Initialize the main application instance globally
window.MainApp = new MainApp();