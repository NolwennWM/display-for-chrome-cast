import { ConfigHandler } from "./modules/configHandler.js";

export default class ConfigForm extends ConfigHandler
{
    configFile = "styleConfig.json";
    form = document.querySelector('#configForm');

    constructor()
    {
        super();
        this.init();
    }

    init()
    {
        console.log("ConfigForm initialized");
        this.loadConfig("styleConfig.json");
    }

}