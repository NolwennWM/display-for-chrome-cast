import { CellsHandler } from './cellsHandler.js';
import { MainCellHandler } from './mainCellHandler.js';

/**
 * Main class serves as the entry point for the public display application
 * Initializes and coordinates the cells display and main cell configuration handlers
 */
class Main
{
    /**
     * Creates a new Main instance and initializes the application
     * Sets up the main application flow for the public display interface
     */
    constructor()
    {
        console.log("Main class initialized");
        this.init();
    }
    
    /**
     * Initializes all application handlers
     * Creates instances of CellsHandler and MainCellHandler to manage display
     */
    init()
    {
        new CellsHandler();
        new MainCellHandler();
    }
}

// Initialize the main application for public display
new Main();