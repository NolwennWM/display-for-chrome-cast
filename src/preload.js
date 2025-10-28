const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('appAPI', 
{
  getConfig: getConfig,
  setConfig: setConfig,
  openBrowser: openBrowser,
  routeTo: routeTo
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
