const { ipcMain } = require('electron');
const { openBrowser, routeTo } = require('../modules/browser');


function registerBrowserIPC()
{
    ipcMain.handle('open-browser', openBrowser);
    ipcMain.handle('route-to', routeTo);
}

module.exports = { registerBrowserIPC };