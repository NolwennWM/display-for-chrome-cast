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
            
            clone.querySelector('.cell-name').textContent = cell.title;

            const description = clone.querySelector('.cell-description');

            this.displayDescription(description, cell.description);
            
            liste.append(clone);
        }
    }
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
    sortCells(a, b)
    {
        return a[1].order - b[1].order;
    }
}