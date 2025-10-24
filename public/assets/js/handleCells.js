async function fetchCells() 
{
    const response = await fetch('/api/cells');
    const data = await response.json();
    return data;
}

export async function displayCells() {
    const salles = await fetchCells();
    const template = document.querySelector('template');
    const liste = document.querySelector('#salle-list');

    for (const [nom, description] of Object.entries(salles)) {
        if(description === "") continue;
        const clone = template.content.cloneNode(true);
        clone.querySelector('.salle-nom').textContent = nom;
        clone.querySelector('.salle-description').textContent = description;
        liste.prepend(clone);
    }
}