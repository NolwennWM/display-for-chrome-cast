const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');
const Images = require('./images');

/**
 * Cells management class for handling display cell operations
 * Provides CRUD functionality for cells configuration including image handling,
 * order management, and validation
 */
class Cells 
{
    /**
     * Initializes the Cells instance with an Images module
     */
    constructor()
    {
        this.images = new Images();
    }

    /**
     * Retrieves all cells from the configuration file
     * Creates an empty configuration if the file doesn't exist
     * @async
     * @returns {Promise<Object>} Object containing all cells data, or empty object on failure
     */
    async fetchCells() 
    {
        const cellsPath = this.getCellPath();
        try {
            const cellsData = await fs.readFile(cellsPath, 'utf8');
            const cells = JSON.parse(cellsData);
            return cells;
        } catch (error) {
            console.error("Error reading cells config:", error);
            // Si le fichier n'existe pas, on le crée avec un objet vide
            if (error.code === 'ENOENT') {
                const emptyConfig = {};
                await this.saveCells(emptyConfig);
                return emptyConfig;
            }
            return {};
        }
    }

    /**
     * Retrieves a specific cell by its ID
     * @async
     * @param {string} cellId - The unique identifier of the cell to retrieve
     * @returns {Promise<Object|null>} The cell data object or null if not found
     */
    async fetchCell(cellId) 
    {
        const cells = await this.fetchCells();
        return cells[cellId] || null;
    }

    /**
     * Creates or updates a cell with validation and order management
     * Handles image cleanup for existing cells and generates IDs for new cells
     * @async
     * @param {string} cellId - The cell ID to set (generates new if invalid)
     * @param {Object} cell - The cell data object to save
     * @returns {Promise<Object>} Object with success property indicating operation result
     */
    async setCell(cellId, cell) 
    {
        try {
            
            cellId = this.isValidCellId(cellId) ? cellId : this.generateCellId();
            
            const cells = await this.fetchCells();
            const oldCell = cells[cellId];
            if(oldCell)
            {
                cell.order = oldCell.order;
            }
            
            
            // Si c'est une nouvelle cellule (pas d'order défini), calculer l'order
            if (cell.order === undefined || cell.order === null) 
            {
                cell.order = this.getNextOrder(cells);
            }
            
            if (!this.isValidCellData(cell)) 
            {
                throw new Error("Invalid cell data");
            }

            await this.isImageCell(oldCell, true);

            cells[cellId] = cell;
            return await this.saveCells(cells);
        } catch (error) {
            console.error("Error writing cells config:", error);
            return { success: false };
        }
    }

    /**
     * Deletes a cell and handles cleanup of associated images
     * @async
     * @param {string} cellId - The unique identifier of the cell to delete
     * @returns {Promise<Object>} Object with success property indicating operation result
     */
    async deleteCell(cellId)
    {
        try {
            const cells = await this.fetchCells();
            const oldCell = cells[cellId];
            await this.isImageCell(oldCell, true);
            delete cells[cellId];
            return await this.saveCells(cells);
        } catch (error) {
            console.error("Error deleting cell from config:", error);
            return { success: false };
        }
    }

    /**
     * Generates the full path to the cells configuration file
     * Creates the config directory if it doesn't exist
     * @returns {string} The complete path to the cellsConfig.json file
     */
    getCellPath()
    {
        // Utilise le répertoire userData d'Electron (répertoire utilisateur)
        const userDataPath = app.getPath('userData');
        const configDir = path.join(userDataPath, 'config');
        console.log("directory :", configDir);
        
        
        // Crée le répertoire config s'il n'existe pas
        fs.mkdir(configDir, { recursive: true }).catch(console.error);
        
        return path.join(configDir, 'cellsConfig.json');
    }

    /**
     * Saves the cells configuration to the JSON file
     * @async
     * @param {Object} cells - The cells data object to save
     * @returns {Promise<Object>} Object with success property indicating operation result
     */
    async saveCells(cells)
    {
        const cellsPath = this.getCellPath();
        try {
            await fs.writeFile(cellsPath, JSON.stringify(cells, null, 2), 'utf8');
            return { success: true };
        } catch (error) {
            console.error("Error saving cells config:", error);
            return { success: false };
        }
    }

    /**
     * Generates a unique cell ID using current timestamp
     * @returns {string} A unique cell identifier in format 'cell_timestamp'
     */
    generateCellId()
    {
        return 'cell_' + Date.now();
    }

    /**
     * Validates if a cell ID follows the correct format
     * @param {string} cellId - The cell ID to validate
     * @returns {boolean} True if the cell ID is valid, false otherwise
     */
    isValidCellId(cellId)
    {
        return /^cell_\d+$/.test(cellId);
    }

    /**
     * Validates cell data structure and required properties
     * @param {Object} cell - The cell object to validate
     * @returns {boolean} True if cell data is valid, false otherwise
     */
    isValidCellData(cell)
    {
        return typeof cell.title === 'string' && 
                        cell.title.trim() !== '' &&
                typeof cell.description === 'string' && 
                typeof cell.display === 'boolean' &&
                typeof cell.order === 'number' &&
                cell.order >= 0;
    }

    /**
     * Checks if a cell contains an image and optionally deletes the image file
     * @async
     * @param {Object} cell - The cell object to check
     * @param {boolean} [toDelete=true] - Whether to delete the image file if found
     * @returns {Promise<boolean>} True if the cell contains an image, false otherwise
     */
    async isImageCell(cell, toDelete = true)
    {
        if(!cell) return false;
        const imageCellRegex = /^\[image='(.+)'\]$/;
        console.log("Checking if cell is image cell:", cell);
        if(cell.description && imageCellRegex.test(cell.description))
        {
            if(toDelete)
            {
                const fileName = cell.description.match(/^\[image='(.+)'\]$/)[1];
                await this.images.deleteImage(fileName);
            }
            return true;
        }
        return false;
    }

    /**
     * Calculates the next available order number for a new cell
     * @param {Object} cells - The cells collection to analyze
     * @returns {number} The next order number (highest existing order + 1, or 1 if no cells)
     */
    getNextOrder(cells)
    {
        const orders = Object.values(cells).map(cell => cell.order || 0);
        
        return orders.length > 0 ? Math.max(...orders) + 1 : 1;
    }

    /**
     * Exchanges the display order between two cells
     * @async
     * @param {string} cellId1 - The ID of the first cell
     * @param {string} cellId2 - The ID of the second cell
     * @returns {Promise<Object>} Object with success property indicating operation result
     * @throws {Error} If one or both cell IDs are invalid
     */
    async exchangeOrders(cellId1, cellId2)
    {
        const cells = await this.fetchCells();
        if (!cells[cellId1] || !cells[cellId2]) 
        {
            throw new Error("One or both cell IDs are invalid");
        }
        
        const tempOrder = cells[cellId1].order?? this.getNextOrder(cells);
        cells[cellId1].order = cells[cellId2].order?? this.getNextOrder(cells);
        cells[cellId2].order = tempOrder;
        return await this.saveCells(cells);
    }
}

module.exports = Cells;
