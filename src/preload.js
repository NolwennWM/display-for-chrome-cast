const { contextBridge, ipcRenderer } = require('electron');

/**
 * PreloadAPI class provides secure communication bridge between renderer and main processes
 * Exposes application API functions to the renderer process through Electron's contextBridge
 */
class PreloadAPI
{
  /**
   * Creates a new PreloadAPI instance and exposes the API
   * Automatically sets up the context bridge for secure IPC communication
   */
  constructor()
  {
    this.exposeAPI();
  }

  /**
   * Exposes the application API to the renderer process
   * Creates secure bridge functions that delegate to IPC methods
   */
  exposeAPI()
  {
    contextBridge.exposeInMainWorld('appAPI', 
    {
      getConfig: (name) => this.getConfig(name),
      setConfig: (name, key, value) => this.setConfig(name, key, value),
      openBrowser: () => this.openBrowser(),
      routeTo: (path) => this.routeTo(path),
      fetchCells: () => this.fetchCells(),
      fetchCell: (cellId) => this.fetchCell(cellId),
      setCell: (cellId, title, description) => this.setCell(cellId, title, description),
      deleteCell: (cellId) => this.deleteCell(cellId),
      exchangeOrders: (cellId1, cellId2) => this.exchangeOrders(cellId1, cellId2),
      saveImage: () => this.saveImage()
    });
  }

  /**
   * Retrieves configuration data from the specified configuration file
   * @param {string} name - Configuration file name
   * @returns {Promise<Object>} Configuration data object
   */
  async getConfig(name) 
  {
    return await ipcRenderer.invoke('get-config', name);
  }

  /**
   * Sets a configuration value in the specified configuration file
   * @param {string} name - Configuration file name
   * @param {string} key - Configuration key to set
   * @param {*} value - Value to set for the configuration key
   * @returns {Promise<Object>} Result object with success status
   */
  async setConfig(name, key, value)
  {
    return await ipcRenderer.invoke('set-config', name, key, value);
  }

  /**
   * Opens the default browser or Chrome to display the application
   * @returns {Promise<void>} Promise that resolves when browser is opened
   */
  async openBrowser() 
  {
    return await ipcRenderer.invoke('open-browser');
  }

  /**
   * Routes to a specific page and returns its content
   * @param {string} path - Path/page name to route to
   * @returns {Promise<string>} HTML content of the requested page
   */
  async routeTo(path) 
  {  
    return await ipcRenderer.invoke('route-to', path);
  }

  /**
   * Fetches all cells data from the configuration
   * @returns {Promise<Object>} Object containing all cells with their IDs as keys
   */
  async fetchCells() 
  {
      return await ipcRenderer.invoke('fetch-cells');
  }

  /**
   * Fetches a specific cell by its ID
   * @param {string} cellId - Unique identifier of the cell to fetch
   * @returns {Promise<Object|null>} Cell data object or null if not found
   */
  async fetchCell(cellId)
  {
      return await ipcRenderer.invoke('fetch-cell', cellId);
  }

  /**
   * Creates or updates a cell with the provided data
   * @param {string} cellId - Cell ID for updates, or null for new cells
   * @param {string} title - Cell title
   * @param {string} description - Cell description content
   * @returns {Promise<Object>} Result object with success status and cell ID
   */
  async setCell(cellId, title, description)
  {
      return await ipcRenderer.invoke('set-cell', cellId, title, description);
  }

  /**
   * Deletes a cell by its ID
   * @param {string} cellId - Unique identifier of the cell to delete
   * @returns {Promise<Object>} Result object with success status
   */
  async deleteCell(cellId)
  {
      return await ipcRenderer.invoke('delete-cell', cellId);
  }

  /**
   * Exchanges the display order of two cells
   * @param {string} cellId1 - ID of the first cell
   * @param {string} cellId2 - ID of the second cell
   * @returns {Promise<Object>} Result object with success status
   */
  async exchangeOrders(cellId1, cellId2)
  {
      return await ipcRenderer.invoke('exchange-orders', cellId1, cellId2);
  }

  /**
   * Opens file dialog to save an image and returns the saved filename
   * @returns {Promise<string|null>} Filename of saved image or null if cancelled
   */
  async saveImage()
  {
      return await ipcRenderer.invoke('save-image');
  }
}

// Automatically instantiate the preload API for secure renderer communication
new PreloadAPI();