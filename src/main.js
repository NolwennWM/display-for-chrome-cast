const { app } = require('electron');
const { createWindow } = require('./modules/window');
const { registerConfigIPC } = require('./ipc/config');
const { registerBrowserIPC } = require('./ipc/browser');
const { registerCellsIPC } = require('./ipc/cells');
const { initializeConfigFiles, isFirstLaunch, debugPaths } = require('./modules/migration');

// Démarre le serveur local
require('./server');

app.whenReady().then(openApp);

app.on('window-all-closed', closeApp);

async function openApp()
{
  try {
    // Affiche les informations de debug sur les chemins
    debugPaths();
    
    // Vérifie si c'est le premier lancement et initialise les fichiers de config si nécessaire
    const firstLaunch = await isFirstLaunch();
    if (firstLaunch) {
      console.log('🚀 Premier lancement détecté, initialisation des fichiers de configuration...');
      await initializeConfigFiles();
    } else {
      console.log('✅ Application déjà initialisée, pas de migration nécessaire');
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de l\'application:', error);
    
  }
  finally {
    console.log('Application prête');
    createWindow(); 
    registerConfigIPC();
    registerBrowserIPC();
    registerCellsIPC();
  }
}
function closeApp() 
{
  // Sur macOS, il est courant que les applications restent actives jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
  if (process.platform !== 'darwin') app.quit();
}
