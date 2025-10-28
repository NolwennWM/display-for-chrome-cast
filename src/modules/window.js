const { app, BrowserWindow, screen } = require('electron');
const { getConfig } = require('./config');
const path = require('path');

async function createWindow() 
{
    const config = await getConfig("mainConfig.json");
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const browserOptions = {
        width: Math.floor(width * (config.width || 0.5)),
        height: Math.floor(height * (config.height || 0.5)),
        fullscreen: config.fullscreen || false,
        webPreferences: {
          preload: path.join(__dirname, "..", 'preload.js'),
          nodeIntegration: false,
          contextIsolation: true
        }
    };


    const win = new BrowserWindow(browserOptions);

    win.loadFile('app/layout.html');

    if (app.isPackaged) return;
    win.webContents.openDevTools();
}
module.exports = { createWindow };