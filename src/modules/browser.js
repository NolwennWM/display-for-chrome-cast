const { shell } = require('electron');
const chromeLauncher = require('chrome-launcher');
const path = require('path');
const fs = require('fs').promises;

/**
 * Browser management class for handling web browser operations
 * Provides functionality for launching Chrome or default browser and serving HTML content
 */
class Browser 
{
  /**
   * Opens a web browser pointing to the local server
   * Attempts to launch Chrome first, falls back to default browser if Chrome is not available
   * @async
   * @returns {Promise<void>} Resolves when browser launch is attempted
   */
  async openBrowser() 
  {
    try
    {
      const chrome = await chromeLauncher.launch({
          startingUrl: 'http://localhost:3000'
      });
      console.log(`Chrome lancé sur le port ${chrome.port}`);
    }
    catch (err)
    {
      console.warn('Chrome non trouvé, ouverture dans le navigateur par défaut');
      shell.openExternal('http://localhost:3000');
    }
  }

  /**
   * Reads and returns the content of an HTML view file
   * Resolves the file path from the app/views directory
   * @async
   * @param {string} pathName - The name of the HTML file (without extension)
   * @returns {Promise<string>} The HTML content of the requested file
   * @throws {Error} If the file cannot be read or doesn't exist
   */
  async routeTo(pathName)
  {
    const filePath = path.join(__dirname, '..', "..", 'app', 'views', pathName + '.html');
    return fs.readFile(filePath, 'utf-8');
  }
}

module.exports = Browser;