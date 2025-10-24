const { ipcMain } = require('electron');
const { getConfig } = require('../modules/config');

function registerConfigIPC() {
  ipcMain.handle('get-config', async (event, name = 'mainConfig.json') => {
    return await getConfig(name);
  });

  ipcMain.handle('set-config', async (event, name, newData) => {
    // todo: implémenter la sauvegarde
    console.log(`Mise à jour de la config ${name}`);
    return { success: true };
  });
};

module.exports = { registerConfigIPC };