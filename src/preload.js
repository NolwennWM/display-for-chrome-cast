const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('appAPI', {
  getConfig: getConfig,
  openBrowser: openBrowser
});

async function getConfig(name) {
  return await ipcRenderer.invoke('get-config', name);
}

async function openBrowser() {
  return await ipcRenderer.invoke('open-browser');
}
