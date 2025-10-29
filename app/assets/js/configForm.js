export default class ConfigForm
{
    form = document.querySelector('#configForm');

    constructor()
    {
        this.init();
    }

    init()
    {
        console.log("ConfigForm initialized");
        if(!window.appAPI || !window.appAPI.getConfig) return;
        this.loadConfig();

    }

    async loadConfig()
    {
        const config = await window.appAPI.getConfig("styleConfig.json");
        console.log("Configuration chargée :", config);
        this.populateForm(config);
    }

    populateForm(config)
    {
        // Remplir le formulaire avec les données de configuration
        for (const [key, value] of Object.entries(config)) 
        {
            const input = this.form.querySelector(`[name="${key}"]`);
            
            if (!input) continue;

            input.value = value;
            input.addEventListener('change', this.saveConfig.bind(this));
        }
    }

    async saveConfig(event)
    {
        if(!window.appAPI || !window.appAPI.setConfig) return;
        const input = event.currentTarget;
        

        try {
            if(!input.name) throw new Error("Le champ du formulaire n'a pas d'attribut 'name'");
            if(input.value === undefined) throw new Error("Le champ du formulaire n'a pas de valeur définie");

            const result = await window.appAPI.setConfig("styleConfig.json", input.name, input.value);

            if(!result.success) throw new Error("Échec de la sauvegarde de la configuration");
            console.log("Configuration sauvegardée :", { [input.name]: input.value });
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la configuration :", error);
        }
    }
}