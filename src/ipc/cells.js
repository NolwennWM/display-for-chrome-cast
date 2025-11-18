const { ipcMain } = require('electron');
const { fetchCells, fetchCell, setCell, deleteCell, exchangeOrders } = require('../modules/cells');

function registerCellsIPC()
{
    ipcMain.handle('fetch-cells', async () => {
        return await fetchCells();
    });
    ipcMain.handle('fetch-cell', async (event, cellId) => {
        return await fetchCell(cellId);
    });
    ipcMain.handle('set-cell', async (event, cellId, title, description) => {
        return await setCell(cellId, title, description);
    }); 
    ipcMain.handle('delete-cell', async (event, cellId) => {
        return await deleteCell(cellId);
    });
    ipcMain.handle('exchange-orders', async (event, cellId1, cellId2) => {
        return await exchangeOrders(cellId1, cellId2);
    });
};

module.exports = { registerCellsIPC };