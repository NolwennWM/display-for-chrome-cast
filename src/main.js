const { app } = require('electron');
const { createWindow } = require('./modules/window');
const { registerConfigIPC } = require('./ipc/config');
const { registerBrowserIPC } = require('./ipc/browser');

// Démarre le serveur local
require('./server');

app.whenReady().then(openApp);

app.on('window-all-closed', closeApp);

function openApp()
{
  createWindow();
  registerConfigIPC();
  registerBrowserIPC();
}
function closeApp() 
{
  // Sur macOS, il est courant que les applications restent actives jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
  if (process.platform !== 'darwin') app.quit();
}
