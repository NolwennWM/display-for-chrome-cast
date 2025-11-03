import { DateTimeHandler } from './dateTimeHandler.js';

export class MainCellHandler
{
    mainCell = document.querySelector('.mainCell');
    constructor()
    {
        console.log("MainCellHandler initialized");
        if(!this.mainCell) return;
        this.init();
    }
    async init()
    {
        const config = await this.#fetchConfig();
        console.log("Fetched config:", config);
        this.setMainCell(config);
    }
    async #fetchConfig() 
    {
        const response = await fetch('/api/cells/main');
        const data = await response.json();
        return data;
    }
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