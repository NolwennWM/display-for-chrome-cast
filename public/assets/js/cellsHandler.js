export class CellsHandler
{
    constructor()
    {
        console.log("CellsHandler initialized");
        this.displayCells();
    }

    async #fetchCells() 
    {
        const response = await fetch('/api/cells');
        const data = await response.json();
        return data;
    }
    
    async displayCells() 
    {
        const cells = await this.#fetchCells();
        const template = document.querySelector('template');
        const liste = document.querySelector('#cell-list');
    
        for (const [key, cell] of Object.entries(cells)) 
        {
            if(cell.description === "") continue;

            const clone = template.content.cloneNode(true);
            clone.querySelector('.cell-nom').textContent = cell.title;
            clone.querySelector('.cell-description').textContent = cell.description;
            
            liste.prepend(clone);
        }
    }
}