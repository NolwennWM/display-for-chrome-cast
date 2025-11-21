const { ipcMain } = require('electron');
const Cells = require('../modules/cells');

/**
 * IPC handler class for cells-related operations
 * Provides secure communication bridge between renderer and main process
 * for cells management functionality including CRUD operations and order management
 */
class CellsIPC
{
    /**
     * Initializes the CellsIPC instance with a Cells module
     */
    constructor()
    {
        this.cells = new Cells();
    }

    /**
     * Registers IPC handlers for cells-related operations
     * Sets up communication channels for complete cells management functionality
     * 
     * Handlers:
     * - 'fetch-cells' - Retrieves all cells from configuration
     * - 'fetch-cell' - Retrieves a specific cell by ID
     * - 'set-cell' - Creates or updates a cell with title and description
     * - 'delete-cell' - Removes a cell and associated resources
     * - 'exchange-orders' - Swaps display order between two cells
     */
    registerCellsIPC()
    {
        ipcMain.handle('fetch-cells', async () => {
            return await this.cells.fetchCells();
        });
        ipcMain.handle('fetch-cell', async (event, cellId) => {
            return await this.cells.fetchCell(cellId);
        });
        ipcMain.handle('set-cell', async (event, cellId, title, description) => {
            return await this.cells.setCell(cellId, title, description);
        }); 
        ipcMain.handle('delete-cell', async (event, cellId) => {
            return await this.cells.deleteCell(cellId);
        });
        ipcMain.handle('exchange-orders', async (event, cellId1, cellId2) => {
            return await this.cells.exchangeOrders(cellId1, cellId2);
        });
    }
}

module.exports = CellsIPC;