/**
 * ConfigHandler class provides base functionality for handling configuration forms
 * Manages loading, populating, and saving configuration data through the application API
 */
export class ConfigHandler
{
    /**
     * Creates a new ConfigHandler instance
     * Base constructor for configuration handling classes
     */
    constructor()
    {

    }

    /**
     * Loads configuration data from a specified file and populates the form
     * Fetches configuration through the API and updates form fields
     * @param {string} configFile - Configuration file name to load
     */
    async loadConfig(configFile = "")
    {
        if(configFile === "" || !window.appAPI || !window.appAPI.getConfig) return;

        this.configFile = configFile;
        const config = await window.appAPI.getConfig(configFile);
        console.log("Configuration chargée :", config);
        this.populateForm(config);
    }
    
    /**
     * Populates form fields with configuration data
     * Maps configuration values to form inputs and sets up change listeners
     * @param {Object} config - Configuration object with key-value pairs
     */
    populateForm(config)
    {
        // Remplir le formulaire avec les données de configuration
        for (const [key, value] of Object.entries(config)) 
        {
            const input = this.form.querySelector(`[name="${key}"]`);
            console.log(key, value);
            
            if (!input) continue;

            switch(input.type)
            {
                case 'checkbox':
                    input.checked = value;
                    break;
                default:
                    input.value = value;
            }
            input.addEventListener('change', this.saveConfig.bind(this));
        }
    }
    
    /**
     * Saves configuration changes when form inputs are modified
     * Handles different input types and persists changes through the API
     * @param {Event} event - Change event from form input elements
     */
    async saveConfig(event)
    {
        if(!window.appAPI || !window.appAPI.setConfig) return;
        const input = event.currentTarget;
        let value = "";

        switch(input.type)
        {
            case 'checkbox':
                value = input.checked;
                break;
            default:
                value = input.value;
        }

        try {
            if(!input.name) throw new Error("Le champ du formulaire n'a pas d'attribut 'name'");
            if(input.value === undefined) throw new Error("Le champ du formulaire n'a pas de valeur définie");

            const result = await window.appAPI.setConfig(this.configFile, input.name, value);

            if(!result.success) throw new Error("Échec de la sauvegarde de la configuration");
            console.log("Configuration sauvegardée :", { [input.name]: value });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la configuration :", error);
        }
    }
}