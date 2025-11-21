const { ipcMain } = require('electron');
const Images = require('../modules/images');

/**
 * IPC handler class for image-related operations
 * Provides secure communication bridge between renderer and main process
 * for image management functionality
 */
class ImagesIPC
{
    /**
     * Initializes the ImagesIPC instance with an Images module
     */
    constructor()
    {
        this.images = new Images();
    }

    /**
     * Registers IPC handlers for image-related operations
     * Sets up communication channels for image saving functionality
     * Handler: 'save-image' - Opens file dialog and saves selected image
     */
    registerImagesIPC() 
    {
        ipcMain.handle('save-image', async (event) => { 
            return await this.images.saveImage();
        });
    }
}

module.exports = ImagesIPC;