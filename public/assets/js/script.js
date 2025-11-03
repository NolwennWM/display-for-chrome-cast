import { CellsHandler } from './cellsHandler.js';
import { MainCellHandler } from './mainCellHandler.js';

class Main
{
    constructor()
    {
        console.log("Main class initialized");
        this.init();
    }
    init()
    {
        new CellsHandler();
        new MainCellHandler();
    }
}

new Main();