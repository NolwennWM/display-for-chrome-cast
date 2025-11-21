const fs = require('fs').promises;
const path = require('path');
const { app, dialog } = require('electron');

/**
 * Images management class for handling image file operations
 * Provides functionality for saving, validating names, and deleting images
 * in the application's user data directory
 */
class Images 
{
    /**
     * Opens a file dialog to select and save an image to the user data directory
     * Handles file validation, unique naming, and copying operations
     * @async
     * @returns {Promise<string|null>} The saved filename if successful, null if cancelled or failed
     */
    async saveImage()
    {
        const result = await dialog.showOpenDialog({
            title: 'Sélectionner une image',
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'webp'] }
            ]
        });
        if (result.canceled || result.filePaths.length === 0) return null;

        const filePaths = result.filePaths[0];
        const originalFileName = path.basename(filePaths);

        // Obtenir un nom de fichier valide (unique)
        const fileName = await this.getValidName(originalFileName);

        const saveDir = path.join(app.getPath('userData'), 'images');
        const savePath = path.join(saveDir, fileName);

        try {
            await fs.mkdir(saveDir, { recursive: true });
            await fs.copyFile(filePaths, savePath);
            console.log(`Image sauvegardée dans : ${savePath}`);
            return fileName;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'image :', error);
            return null;
        }
    }

    /**
     * Generates a unique filename by adding a counter if the original name already exists
     * Ensures no file conflicts when saving new images
     * @async
     * @param {string} originalName - The original filename to validate
     * @returns {Promise<string>} A unique filename that doesn't conflict with existing files
     */
    async getValidName(originalName)
    {
        const saveDir = path.join(app.getPath('userData'), 'images');
        
        // Séparer le nom et l'extension
        const parsedPath = path.parse(originalName);
        const nameWithoutExt = parsedPath.name;
        const extension = parsedPath.ext;
        
        let counter = 1;
        let fileName = originalName;
        let filePath = path.join(saveDir, fileName);

        /**
         * Checks if a file exists at the given path
         * @async
         * @param {string} filePath - The file path to check
         * @returns {Promise<boolean>} True if file exists, false otherwise
         */
        async function exists(filePath)
        {
            try
            {
                await fs.access(filePath);
                return true;
            }
            catch {
                return false;
            }
        }
        
        // Vérifier si le fichier existe déjà
        while (await exists(filePath)) 
        {
            // Générer un nouveau nom avec un compteur
            fileName = `${nameWithoutExt}_${counter}${extension}`;
            filePath = path.join(saveDir, fileName);
            counter++;
        }
        
        return fileName;
    }

    /**
     * Deletes an image file from the user data images directory
     * Provides error handling and success/failure feedback
     * @async
     * @param {string} fileName - The name of the file to delete
     * @returns {Promise<Object>} Object with success property indicating operation result
     */
    async deleteImage(fileName)
    {
        const saveDir = path.join(app.getPath('userData'), 'images');
        const filePath = path.join(saveDir, fileName);
        try {
            await fs.unlink(filePath);
            console.log(`Image supprimée : ${filePath}`);
            return { success: true };
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'image :', error);
            return { success: false };
        }
    }
}

module.exports = Images;