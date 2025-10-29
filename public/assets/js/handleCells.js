async function fetchCells() 
{
    const response = await fetch('/api/cells');
    const data = await response.json();
    return data;
}

export async function displayCells() {
    const cells = await fetchCells();
    const template = document.querySelector('template');
    const liste = document.querySelector('#salle-list');

    for (const [key, cell] of Object.entries(cells)) {
        if(cell.description === "") continue;
        const clone = template.content.cloneNode(true);
        clone.querySelector('.salle-nom').textContent = cell.title;
        clone.querySelector('.salle-description').textContent = cell.description;
        liste.prepend(clone);
    }
}