const fs = require('fs').promises;
const path = require('path');
const { app, dialog } = require('electron');

async function saveImage()
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
    const fileName = await getValidName(originalFileName);

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

async function getValidName(originalName)
{
    const saveDir = path.join(app.getPath('userData'), 'images');
    
    // Séparer le nom et l'extension
    const parsedPath = path.parse(originalName);
    const nameWithoutExt = parsedPath.name;
    const extension = parsedPath.ext;
    
    let counter = 1;
    let fileName = originalName;
    let filePath = path.join(saveDir, fileName);

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

async function deleteImage(fileName)
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

module.exports = { saveImage, deleteImage };