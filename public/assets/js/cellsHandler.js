/**
 * CellsHandler class manages the display of cells on the public interface
 * Fetches cell data from API and renders them with proper formatting and ordering
 */
export class CellsHandler
{
    /**
     * Creates a new CellsHandler instance and initializes cell display
     * Automatically starts the cell loading and rendering process
     */
    constructor()
    {
        console.log("CellsHandler initialized");
        this.displayCells();
    }

    /**
     * Fetches cell data from the API endpoint
     * Makes HTTP request to retrieve all cell configurations
     * @returns {Promise<Object>} Cell data object from the API
     * @private
     */
    async #fetchCells() 
    {
        const response = await fetch('/api/cells');
        const data = await response.json();
        return data;
    }
    
    /**
     * Displays all visible cells in the DOM
     * Fetches cells, sorts them by order, and renders only displayed cells
     */
    async displayCells() 
    {
        const cells = await this.#fetchCells();
        const template = document.querySelector('template');
        const liste = document.querySelector('#cell-list');

        const sortedCells = Object.entries(cells).sort(this.sortCells);
    
        for (const [key, cell] of sortedCells) 
        {
            if(!cell.display) continue;

            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.cell-name').textContent = cell.title;

            const description = clone.querySelector('.cell-description');

            this.displayDescription(description, cell.description);
            
            liste.append(clone);
        }
    }
    
    /**
     * Handles the display of cell descriptions with special formatting
     * Processes text descriptions and converts image tags to actual images
     * @param {HTMLElement} descriptionElement - DOM element to contain the description
     * @param {string} descriptionText - Raw description text from cell data
     */
    displayDescription(descriptionElement, descriptionText)
    {
        if(!descriptionText)
        {
            descriptionElement.remove();
            return;
        }
        const imageTagMatch = descriptionText.match(/^\[image='(.+)'\]$/);
        if(imageTagMatch)
        {
            const imagePath = imageTagMatch[1];
            const img = document.createElement('img');
            img.src = `/uploads/${imagePath}`;
            img.alt = 'Image cell';
            descriptionElement.replaceWith(img);
            return;
        }
        descriptionElement.textContent = descriptionText;
    }
    
    /**
     * Sorts cells by their order property in ascending order
     * Used for consistent display ordering of cells
     * @param {Array} a - First cell entry [key, cellData]
     * @param {Array} b - Second cell entry [key, cellData]
     * @returns {number} Comparison result for sorting
     */
    sortCells(a, b)
    {
        return a[1].order - b[1].order;
    }
}