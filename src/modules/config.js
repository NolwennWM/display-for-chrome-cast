const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

function getConfigPath(configFile) {
  // Utilise le répertoire userData d'Electron (répertoire utilisateur)
  const userDataPath = app.getPath('userData');
  console.log(userDataPath);
  
  const configDir = path.join(userDataPath, 'config');
  
  // Crée le répertoire config s'il n'existe pas
  fs.mkdir(configDir, { recursive: true }).catch(console.error);
  
  return path.join(configDir, configFile);
}

async function getConfig(configFile = "") 
{
  const configPath = getConfigPath(configFile);
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

async function setConfig(configFile = "", key = "", value = "")
{
  const configPath = getConfigPath(configFile);
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

module.exports = { getConfig, setConfig, getConfigPath };
