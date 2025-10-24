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

module.exports = { getConfig };
