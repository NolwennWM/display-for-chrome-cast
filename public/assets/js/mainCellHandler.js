import { DateTimeHandler } from './dateTimeHandler.js';

/**
 * MainCellHandler class manages the main cell display configuration
 * Handles fetching main cell config and setting up date, time, and logo displays
 */
export class MainCellHandler
{
    /** @type {HTMLElement} Main cell container element */
    mainCell = document.querySelector('.mainCell');
    
    /**
     * Creates a new MainCellHandler instance and initializes it
     * Checks for main cell element existence and starts initialization
     */
    constructor()
    {
        console.log("MainCellHandler initialized");
        if(!this.mainCell) return;
        this.init();
    }
    
    /**
     * Initializes the main cell by fetching configuration and setting up display
     * Loads main cell configuration from API and applies it to the display
     */
    async init()
    {
        const config = await this.#fetchConfig();
        console.log("Fetched config:", config);
        this.setMainCell(config);
    }
    
    /**
     * Fetches main cell configuration from the API
     * Makes HTTP request to retrieve main cell display settings
     * @returns {Promise<Object>} Main cell configuration object
     * @private
     */
    async #fetchConfig() 
    {
        const response = await fetch('/api/cells/main');
        const data = await response.json();
        return data;
    }
    
    /**
     * Sets up the main cell display based on configuration
     * Conditionally adds date, logo, and time elements based on config settings
     * @param {Object} config - Main cell configuration object
     */
    setMainCell(config)
    {
        if(!config) return;

        const dateTimeHandler = new DateTimeHandler();

        if(config.date_format !== "none")
        {
            const date = dateTimeHandler.displayDate(config.date_format);
            this.mainCell.append(date);
        }
        if(config.logo_enabled && config.logo_path !== "")
        {
            const logo = document.createElement('img');
            logo.src = config.logo_path;
            logo.alt = 'Logo Entreprise';
            this.mainCell.append(logo);
        }
        if(config.time_format !== "none")
        {
            const time = dateTimeHandler.displayClock(config.time_format);
            this.mainCell.append(time);
        }
    }

}