import { ConfigHandler } from "./modules/configHandler.js";

export default class MainCellForm extends ConfigHandler
{
    form = document.querySelector('#mainCellForm');
    constructor()
    {
        super();
        this.init();
    }

    init()
    {
        console.log("Main Cell Form initialized");
        this.loadConfig("mainCellConfig.json");
    }
}