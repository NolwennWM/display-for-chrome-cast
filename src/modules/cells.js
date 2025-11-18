const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');
const { get } = require('http');

async function fetchCells() 
{
    const cellsPath = getCellPath();
    try {
        const cellsData = await fs.readFile(cellsPath, 'utf8');
        const cells = JSON.parse(cellsData);
        return cells;
    } catch (error) {
        console.error("Error reading cells config:", error);
        // Si le fichier n'existe pas, on le crée avec un objet vide
        if (error.code === 'ENOENT') {
            const emptyConfig = {};
            await saveCells(emptyConfig);
            return emptyConfig;
        }
        return {};
    }
}

async function fetchCell(cellId) 
{
    const cells = await fetchCells();
    return cells[cellId] || null;
}

async function setCell(cellId, cell) 
{
    try {
        const cells = await fetchCells();
        console.log("Current cells before setCell:", cells);
        console.log("Using cell ID Before:", cellId);
        console.log("Is valid cell ID:", isValidCellId(cellId));
        cellId = isValidCellId(cellId) ? cellId : generateCellId();
        console.log("Using cell ID After:", cellId);
        
        // Si c'est une nouvelle cellule (pas d'order défini), calculer l'order
        if (cell.order === undefined || cell.order === null) 
        {
            cell.order = getNextOrder(cells);
        }
        
        if (!isValidCellData(cell)) 
        {
            throw new Error("Invalid cell data");
        }

        
        cells[cellId] = cell;
        return await saveCells(cells);
    } catch (error) {
        console.error("Error writing cells config:", error);
        return { success: false };
    }
}

async function deleteCell(cellId)
{
    const cellsPath = getCellPath();
    try {
        const cells = await fetchCells();
        delete cells[cellId];
        return await saveCells(cells);
    } catch (error) {
        console.error("Error deleting cell from config:", error);
        return { success: false };
    }
}

function getCellPath()
{
    // Utilise le répertoire userData d'Electron (répertoire utilisateur)
    const userDataPath = app.getPath('userData');
    const configDir = path.join(userDataPath, 'config');
    console.log("directory :", configDir);
    
    
    // Crée le répertoire config s'il n'existe pas
    fs.mkdir(configDir, { recursive: true }).catch(console.error);
    
    return path.join(configDir, 'cellsConfig.json');
}
async function saveCells(cells)
{
    const cellsPath = getCellPath();
    try {
        await fs.writeFile(cellsPath, JSON.stringify(cells, null, 2), 'utf8');
        return { success: true };
    } catch (error) {
        console.error("Error saving cells config:", error);
        return { success: false };
    }
}
function generateCellId()
{
    return 'cell_' + Date.now();
}
function isValidCellId(cellId)
{
    return /^cell_\d+$/.test(cellId);
}
function isValidCellData(cell)
{
    return typeof cell.title === 'string' && 
                    cell.title.trim() !== '' &&
            typeof cell.description === 'string' && 
            typeof cell.display === 'boolean' &&
            typeof cell.order === 'number' &&
            cell.order >= 0;
}

function getNextOrder(cells)
{
    const orders = Object.values(cells).map(cell => cell.order || 0);
    
    return orders.length > 0 ? Math.max(...orders) + 1 : 1;
}
async function exchangeOrders(cellId1, cellId2)
{
    const cells = await fetchCells();
    if (!cells[cellId1] || !cells[cellId2]) 
    {
        throw new Error("One or both cell IDs are invalid");
    }
    
    const tempOrder = cells[cellId1].order?? getNextOrder(cells);
    cells[cellId1].order = cells[cellId2].order?? getNextOrder(cells);
    cells[cellId2].order = tempOrder;
    return await saveCells(cells);
}

module.exports = { fetchCells, fetchCell, setCell, deleteCell, exchangeOrders };
