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

        const sortedCells = Object.entries(cells).sort(this.sortCells);
    
        for (const [key, cell] of sortedCells) 
        {
            if(!cell.display) continue;

            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.cell-nom').textContent = cell.title;

            const description = clone.querySelector('.cell-description');
            if(cell.description !== "") description.textContent = cell.description;
            else description.remove();
            
            liste.append(clone);
        }
    }

    sortCells(a, b)
    {
        return a[1].order - b[1].order;
    }
}