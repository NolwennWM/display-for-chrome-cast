const fs = require('fs').promises;
const path = require('path');

async function getConfig(configFile = "") 
{
  const configPath = path.join(__dirname, "..", "..", 'config', configFile);
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (err) {
    console.error('Impossible de lire ou parser le fichier de configuration :', configPath, err);
    return {}; // fallback si fichier introuvable ou JSON invalide
  }
}

async function setConfig(configFile = "", key = "", value = "")
{
  const configPath = path.join(__dirname, "..", "..", 'config', configFile);
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);
    config[key] = value;
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Impossible de mettre à jour le fichier de configuration :', configPath, err);
    return { success: false };
  }
}

module.exports = { getConfig, setConfig };
