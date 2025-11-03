export class ConfigHandler
{
    constructor()
    {

    }

    async loadConfig(configFile = "")
    {
        if(configFile === "" || !window.appAPI || !window.appAPI.getConfig) return;

        this.configFile = configFile;
        const config = await window.appAPI.getConfig(configFile);
        console.log("Configuration chargée :", config);
        this.populateForm(config);
    }
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