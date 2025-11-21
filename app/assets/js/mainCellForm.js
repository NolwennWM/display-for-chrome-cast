import { ConfigHandler } from "./modules/configHandler.js";

/**
 * MainCellForm class extends ConfigHandler to manage main cell configuration forms
 * Handles loading and managing main cell configuration data through a form interface
 */
export default class MainCellForm extends ConfigHandler
{
    /** @type {HTMLFormElement} Form element for main cell configuration input */
    form = document.querySelector('#mainCellForm');
    
    /**
     * Creates a new MainCellForm instance and initializes it
     * Calls parent constructor and sets up the main cell form
     */
    constructor()
    {
        super();
        this.init();
    }

    /**
     * Initializes the MainCellForm by loading the main cell configuration
     * Sets up the form with current main cell settings from the config file
     */
    init()
    {
        console.log("Main Cell Form initialized");
        this.loadConfig("mainCellConfig.json");
    }
}