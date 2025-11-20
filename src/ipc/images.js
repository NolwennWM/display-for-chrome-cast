const { ipcMain } = require('electron');
const { saveImage } = require('../modules/images');

function registerImagesIPC() 
{
    ipcMain.handle('save-image', async (event) => { 
        return await saveImage();
    });
};

module.exports = { registerImagesIPC };