const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

/**
 * Configuration management class for handling application settings
 * Provides functionality for reading, writing, and managing JSON configuration files
 * in the application's user data directory
 */
class Config 
{
  /**
   * Generates the full path for a configuration file in the user data directory
   * Creates the config directory if it doesn't exist
   * @param {string} configFile - The name of the configuration file
   * @returns {string} The complete path to the configuration file
   */
  getConfigPath(configFile) {
    // Utilise le répertoire userData d'Electron (répertoire utilisateur)
    const userDataPath = app.getPath('userData');
    console.log(userDataPath);
    
    const configDir = path.join(userDataPath, 'config');
    
    // Crée le répertoire config s'il n'existe pas
    fs.mkdir(configDir, { recursive: true }).catch(console.error);
    
    return path.join(configDir, configFile);
  }

  /**
   * Reads and parses a JSON configuration file
   * Creates an empty configuration file if it doesn't exist
   * @async
   * @param {string} [configFile=""] - The name of the configuration file to read
   * @returns {Promise<Object>} The parsed configuration object, or empty object on failure
   */
  async getConfig(configFile = "") 
  {
    const configPath = this.getConfigPath(configFile);
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (err) {
      console.error('Impossible de lire ou parser le fichier de configuration :', configPath, err);
      // Si le fichier n'existe pas, on le crée avec un objet vide
      if (err.code === 'ENOENT') {
        const emptyConfig = {};
        await fs.writeFile(configPath, JSON.stringify(emptyConfig, null, 2), 'utf-8');
        return emptyConfig;
      }
      return {}; // fallback si fichier introuvable ou JSON invalide
    }
  }

  /**
   * Updates a specific key-value pair in a configuration file
   * Reads existing configuration, updates the specified key, and writes back to file
   * @async
   * @param {string} [configFile=""] - The name of the configuration file to update
   * @param {string} [key=""] - The configuration key to update
   * @param {*} [value=""] - The value to set for the specified key
   * @returns {Promise<Object>} Object with success property indicating operation result
   */
  async setConfig(configFile = "", key = "", value = "")
  {
    const configPath = this.getConfigPath(configFile);
    try {
      let config = {};
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);
      
      config[key] = value;
      console.log("Updated config:", config);
      
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      return { success: true };
    } catch (err) {
      console.error('Impossible de mettre à jour le fichier de configuration :', configPath, err);
      return { success: false };
    }
  }
}

module.exports = Config;
