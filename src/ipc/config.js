const { ipcMain } = require('electron');
const Config = require('../modules/config');

/**
 * IPC handler class for configuration-related operations
 * Provides secure communication bridge between renderer and main process
 * for configuration management functionality
 */
class ConfigIPC
{
    /**
     * Initializes the ConfigIPC instance with a Config module
     */
    constructor()
    {
        this.config = new Config();
    }

    /**
     * Registers IPC handlers for configuration-related operations
     * Sets up communication channels for reading and writing configuration data
     * 
     * Handlers:
     * - 'get-config' - Retrieves configuration data from specified file
     * - 'set-config' - Updates a specific key-value pair in configuration file
     */
    registerConfigIPC() 
    {
      ipcMain.handle('get-config', async (event, name = 'mainConfig.json') => {
        return await this.config.getConfig(name);
      });

      ipcMain.handle('set-config', async (event, name= 'mainConfig.json', key = '', value = '') => {
        const result = await this.config.setConfig(name, key, value);
        console.log(`Mise à jour de la config ${name}`);
        return result;
      });
    }
}

module.exports = ConfigIPC;