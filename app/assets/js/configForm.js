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
        }
    }
}