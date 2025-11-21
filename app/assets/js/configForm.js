import { ConfigHandler } from "./modules/configHandler.js";

/**
 * ConfigForm class extends ConfigHandler to manage style configuration forms
 * Handles loading and managing style configuration data through a form interface
 */
export default class ConfigForm extends ConfigHandler
{
    /** @type {string} Configuration file name for style settings */
    configFile = "styleConfig.json";
    
    /** @type {HTMLFormElement} Form element for configuration input */
    form = document.querySelector('#configForm');

    /**
     * Creates a new ConfigForm instance and initializes it
     * Calls parent constructor and sets up the form
     */
    constructor()
    {
        super();
        this.init();
    }

    /**
     * Initializes the ConfigForm by loading the style configuration
     * Sets up the form with current style settings from the config file
     */
    init()
    {
        console.log("ConfigForm initialized");
        this.loadConfig("styleConfig.json");
    }

}