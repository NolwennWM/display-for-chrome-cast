const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('appAPI', 
{
  getConfig: getConfig,
  setConfig: setConfig,
  openBrowser: openBrowser,
  routeTo: routeTo,
  fetchCells: fetchCells,
  fetchCell: fetchCell,
  setCell: setCell,
  deleteCell: deleteCell,
  exchangeOrders: exchangeOrders
});

async function getConfig(name) 
{
  return await ipcRenderer.invoke('get-config', name);
}
async function setConfig(name, key, value)
{
  return await ipcRenderer.invoke('set-config', name, key, value);
}

async function openBrowser() 
{
  return await ipcRenderer.invoke('open-browser');
}

async function routeTo(path) 
{  
  return await ipcRenderer.invoke('route-to', path);
}

async function fetchCells() 
{
    return await ipcRenderer.invoke('fetch-cells');
}
async function fetchCell(cellId)
{
    return await ipcRenderer.invoke('fetch-cell', cellId);
}
async function setCell(cellId, title, description)
{
    return await ipcRenderer.invoke('set-cell', cellId, title, description);
}
async function deleteCell(cellId)
{
    return await ipcRenderer.invoke('delete-cell', cellId);
}
async function exchangeOrders(cellId1, cellId2)
{
    return await ipcRenderer.invoke('exchange-orders', cellId1, cellId2);
}