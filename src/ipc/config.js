const { ipcMain } = require('electron');
const { getConfig, setConfig } = require('../modules/config');

function registerConfigIPC() 
{
  ipcMain.handle('get-config', async (event, name = 'mainConfig.json') => {
    return await getConfig(name);
  });

  ipcMain.handle('set-config', async (event, name= 'mainConfig.json', key = '', value = '') => {
    const result = await setConfig(name, key, value);
    console.log(`Mise à jour de la config ${name}`);
    return result;
  });
};

module.exports = { registerConfigIPC };