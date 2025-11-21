const { ipcMain } = require('electron');
const Browser = require('../modules/browser');

/**
 * IPC handler class for browser-related operations
 * Provides secure communication bridge between renderer and main process
 * for browser management and HTML content serving functionality
 */
class BrowserIPC
{
    /**
     * Initializes the BrowserIPC instance with a Browser module
     */
    constructor()
    {
        this.browser = new Browser();
    }

    /**
     * Registers IPC handlers for browser-related operations
     * Sets up communication channels for browser launching and HTML content routing
     * 
     * Handlers:
     * - 'open-browser' - Launches Chrome or default browser pointing to localhost:3000
     * - 'route-to' - Returns HTML content from specified view file
     */
    registerBrowserIPC()
    {
        ipcMain.handle('open-browser', () => this.browser.openBrowser());
        ipcMain.handle('route-to', (event, pathName) => this.browser.routeTo(pathName));
    }
}

module.exports = BrowserIPC;