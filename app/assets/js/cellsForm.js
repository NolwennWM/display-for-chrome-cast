import {ModalNWM} from './modal-nwm/modalnwm.js';

export default class CellsForm
{
    tableBody = document.querySelector('#cellsTable tbody');
    dialog = document.querySelector('#cellDialog');
    form = document.querySelector('#cellForm');
    addButton = document.querySelector('#addCellButton');
    modal = document.createElement("dialog", { is: 'modal-nwm' });

    constructor()
    {
        this.init();
        
    }

    init()
    {
        console.log("CellsForm initialized");
        if(!window.appAPI || !window.appAPI.fetchCells) return;
        this.loadCells();
        this.addButton?.addEventListener('click', this.displayDialog.bind(this));
        this.form?.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.dialog?.querySelector('#cancelBtn')?.addEventListener('click', this.hideDialog.bind(this));
        this.tableBody?.addEventListener('click', this.handleEvents.bind(this));
        document.body.append(this.modal);
    }
    async loadCells()
    {
        const cells = await window.appAPI.fetchCells();        
        console.log("Cells chargées :", cells);
        const sortedCells = Object.entries(cells).sort(this.sortCells);
        console.log("Cells triées :", sortedCells);
        this.populateForm(sortedCells);
    }
    sortCells(a, b)
    {
        return a[1].order - b[1].order;
    }
    populateForm(cells)
    {
        for (const [id, cell] of cells) 
        {
            console.log("Cell :", cell);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cell.title}</td>
                <td>${cell.description}</td>
                <td class="actions-cell">
                    <button class="edit-btn table-btn" data-id="${id}" data-role="edit">
                        <img src="assets/images/edit_icon.svg" alt="icon crayon" width="16" height="16">
                    </button>
                    <button class="delete-btn table-btn" data-id="${id}" data-role="delete">
                        <img src="assets/images/delete_icon.svg" alt="icon poubelle" width="16" height="16">
                    </button>
                    <button class="display-btn table-btn ${cell.display ? 'displayed' : ''}" data-id="${id}" data-role="display">
                        <img src="assets/images/eye_open.svg" alt="icon oeil ouvert" width="16" height="16" class="toDisplay">
                        <img src="assets/images/eye_close.svg" alt="icon oeil barré" width="16" height="16" class="toHide">
                    </button>
                    <span class="order-handles">
                        <button class="move-up-btn table-btn" data-id="${id}" title="Monter" data-role="move-up">↑</button>
                        <button class="move-down-btn table-btn" data-id="${id}" title="Descendre" data-role="move-down">↓</button>
                    </span>
                </td>
            `;
            row.dataset.cellId = id;
            this.tableBody.append(row);
        }
    }
    handleEvents(event)
    {
        const button = event.target.closest('.table-btn');
        if (!button) return; // Pas un bouton, ignorer
        const role = button.getAttribute('data-role');
        switch (role) 
        {
            case 'edit':
                this.editCell(button);
                break;
            case 'delete':
                this.deleteCell(button);
                break;
            case 'display':
                this.toggleDisplayCell(button);
                break;
            case 'move-up':
            case 'move-down':
                this.moveCell(button);
                break;
            default:
                console.warn("Rôle de bouton inconnu :", role);
        }
    }
    async deleteCell(button)
    {
        if(!await this.modal.confirm("Êtes-vous sûr de vouloir supprimer cette cellule ?")) return;
        
        const cellId = button.getAttribute('data-id');
        console.log("Supprimer la cellule avec ID :", cellId);
        // Appeler l'API pour supprimer la cellule
        if(!window.appAPI || !window.appAPI.deleteCell) return;
        try
        {
            if(!cellId) throw new Error("ID de cellule invalide");
            const result = await window.appAPI.deleteCell(cellId);
            if(!result.success) throw new Error("Échec de la suppression de la cellule");
            console.log("Cellule supprimée avec succès :", cellId);
            // Retirer la ligne du tableau
            button.closest('tr').remove();
        }
        catch (error)
        {
            console.error("Erreur lors de la suppression de la cellule :", error);
        }
    }
    async editCell(button)
    {
        const cellId = button.getAttribute('data-id');
        console.log("Éditer la cellule avec ID :", cellId);
        // Logique pour éditer la cellule (afficher un formulaire, etc.)
        this.displayDialog(cellId);
    }
    async handleFormSubmit(event)
    {
        event.preventDefault();
        const cellId = this.form.cellId.value;
        const cell = {
            title: this.form.title.value,
            description: this.form.description.value,
            display: true
        };
        console.log("Soumission du formulaire pour la cellule :", { cellId, cell });
        const result = await this.saveCell(cellId, cell);
        if(!result.success) return;
        // Recharger la liste des cellules
        this.tableBody.innerHTML = '';
        this.loadCells();
        this.dialog.close();
        this.form.cellId.value = '';

    }
    async saveCell(cellId, cell)
    {
        if(!window.appAPI || !window.appAPI.setCell) return;
        try {
            if(!cellId) cellId = null; // Pour une nouvelle cellule
            const result = await window.appAPI.setCell(cellId, cell);
            if(!result.success) throw new Error("Échec de la sauvegarde de la cellule");
            console.log("Cellule sauvegardée avec succès :", { cellId, ...cell });
            return { success: true, cellId: result.cellId };
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la cellule :", error);
            return { success: false };
        }
    }
    async displayDialog(cellId = null)
    {
        this.dialog.showModal();
        if(typeof cellId === "string" && window.appAPI && window.appAPI.fetchCell)
        {
            const cell = await window.appAPI.fetchCell(cellId);
            if(cell)
            {
                this.form.title.value = cell.title;
                this.form.description.value = cell.description;
                this.form.cellId.value = cellId;
            }
        }
        else
        {
            // Réinitialiser le formulaire pour une nouvelle cellule
            this.form.reset();
        }
    }
    hideDialog()
    {
        this.dialog.close();
    }
    async toggleDisplayCell(button)
    {
        const cellId = button.getAttribute('data-id');
        console.log("Basculer l'affichage de la cellule avec ID :", cellId);
        if(!window.appAPI || !window.appAPI.fetchCell || !window.appAPI.setCell) return;
        try {
            const cell = await window.appAPI.fetchCell(cellId);
            if(!cell) throw new Error("Cellule introuvable");
            cell.display = !cell.display;
    
            await window.appAPI.setCell(cellId, cell);
            console.log("Affichage de la cellule mis à jour :", cellId);
            button.classList.toggle('displayed', cell.display);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'affichage de la cellule :", error);
        }
    }

    async moveCell(button)
    {
        if(!window.appAPI || !window.appAPI.exchangeOrders) return;
        const cellId = button.getAttribute('data-id');
        const direction = button.classList.contains('move-up-btn') ? 'up' : 'down';
        console.log(`Déplacer la cellule avec ID : ${cellId} vers le ${direction}`);

        // Logique pour déplacer la cellule (mettre à jour l'ordre, recharger la liste, etc.)
        const currentCell = button.closest('tr');
        let siblingCell;
        switch(button.dataset.role)
        {
            case 'move-up':
                siblingCell = currentCell.previousElementSibling;
                siblingCell?.before(currentCell);
                break;
            case 'move-down':
                siblingCell = currentCell.nextElementSibling;
                siblingCell?.after(currentCell);
                break;
            default:
                return;
        }
        if(!siblingCell) return; // Pas de cellule sœur, ne rien faire
        
        const siblingId = siblingCell.dataset.cellId;
        await window.appAPI.exchangeOrders(cellId, siblingId);
        console.log("Ordres des cellules échangés :", cellId, siblingId);
    }
}