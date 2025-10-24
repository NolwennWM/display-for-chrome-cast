const { ipcMain } = require('electron');
const { openBrowser } = require('../modules/browser');


function registerBrowserIPC()
{
    ipcMain.handle('open-browser', openBrowser);
}

module.exports = { registerBrowserIPC };