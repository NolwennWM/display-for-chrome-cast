const { app, BrowserWindow, screen } = require('electron');
const Config = require('./config');
const path = require('path');

/**
 * Window class manages Electron window creation and configuration
 * Handles window sizing, positioning, and browser options based on user configuration
 */
class Window 
{
    /**
     * Creates a new Window instance and initializes configuration handler
     * Sets up the configuration manager for reading window settings
     */
    constructor()
    {
        /** @type {Config} Configuration handler for reading window settings */
        this.config = new Config();
    }

    /**
     * Creates and configures the main application window
     * Loads window configuration, calculates dimensions based on screen size,
     * and creates BrowserWindow with security settings and preload script
     * @returns {Promise<void>} Promise that resolves when window is created
     */
    async createWindow() 
    {
        const config = await this.config.getConfig("mainConfig.json");
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
}

module.exports = Window;