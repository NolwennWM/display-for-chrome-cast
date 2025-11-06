import {ModalNWM} from "./modal-nwm/modalnwm.js";

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
        document.body.append(this.modal);
    }
    async loadCells()
    {
        const cells = await window.appAPI.fetchCells();        
        console.log("Cells chargées :", cells);
        this.populateForm(cells);
    }
    populateForm(cells)
    {
        for (const [id, cell] of Object.entries(cells)) 
        {
            console.log("Cell :", cell);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cell.title}</td>
                <td>${cell.description}</td>
                <td class="actions-cell">
                    <button class="edit-btn table-btn" data-id="${id}">
                        <img src="assets/images/edit_icon.svg" alt="icon crayon" width="16" height="16">
                    </button>
                    <button class="delete-btn table-btn" data-id="${id}">
                        <img src="assets/images/delete_icon.svg" alt="icon poubelle" width="16" height="16">
                    </button>
                    <button class="display-btn table-btn ${cell.display ? 'displayed' : ''}" data-id="${id}">
                        <img src="assets/images/eye_open.svg" alt="icon oeil ouvert" width="16" height="16" class="toDisplay">
                        <img src="assets/images/eye_close.svg" alt="icon oeil barré" width="16" height="16" class="toHide">
                    </button>
                </td>
            `;
            this.tableBody.append(row);
            const editButton = row.querySelector('.edit-btn');
            editButton?.addEventListener('click', this.editCell.bind(this));
            const deleteButton = row.querySelector('.delete-btn');
            deleteButton?.addEventListener('click', this.deleteCell.bind(this));
            const displayButton = row.querySelector('.display-btn');
            displayButton?.addEventListener('click', this.toggleDisplayCell.bind(this));
        }
    }
    async deleteCell(event)
    {
        const button = event.currentTarget;
        if(!await this.modal.confirm("Êtes-vous sûr de vouloir supprimer cette cellule ?")) return;
        console.log(event);
        
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
    async editCell(event)
    {
        const button = event.currentTarget;
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
    async toggleDisplayCell(event)
    {
        const button = event.currentTarget;
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
}