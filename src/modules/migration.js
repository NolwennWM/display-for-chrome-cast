const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

/**
 * Module de migration pour copier les fichiers de configuration par défaut
 * vers le répertoire utilisateur lors du premier lancement
 */

async function initializeConfigFiles() {
    try {
        console.log('🔄 Initialisation des fichiers de configuration...');
        
        const userDataPath = app.getPath('userData');
        const userConfigDir = path.join(userDataPath, 'config');
        
        // Crée le répertoire config utilisateur s'il n'existe pas
        await fs.mkdir(userConfigDir, { recursive: true });
        
        // Liste des fichiers de configuration à migrer
        const configFiles = [
            'cellsConfig.json',
            'mainConfig.json',
            'styleConfig.json'
        ];
        
        for (const configFile of configFiles) {
            await migrateConfigFile(configFile, userConfigDir);
        }
        
        console.log('✅ Initialisation des fichiers de configuration terminée');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des fichiers de configuration:', error);
    }
}

async function migrateConfigFile(configFileName, userConfigDir) 
{
    const userConfigPath = path.join(userConfigDir, configFileName);
    
    try {
        // Vérifie si le fichier existe déjà dans le répertoire utilisateur
        await fs.access(userConfigPath);
        console.log(`📁 ${configFileName} existe déjà dans le répertoire utilisateur`);
        return; // Le fichier existe déjà, pas besoin de migration
        
    } catch (error) {
        // Le fichier n'existe pas, on procède à la migration
        console.log(`📋 Migration de ${configFileName}...`);
        
        let migrationSuccess = false;
        
        // Essaie plusieurs emplacements pour les fichiers par défaut
        const possiblePaths = [
            // En mode development
            path.join(__dirname, '..', '..', 'config', configFileName),
            // En mode production
            path.join(process.resourcesPath, 'app', 'config', configFileName),
            // Chemin alternatif
            path.join(path.dirname(process.execPath), 'resources', 'app', 'config', configFileName)
        ];
        
        for (const defaultConfigPath of possiblePaths) {
            try {
                console.log(`🔍 Recherche de ${configFileName} dans: ${defaultConfigPath}`);
                const defaultData = await fs.readFile(defaultConfigPath, 'utf-8');
                await fs.writeFile(userConfigPath, defaultData, 'utf-8');
                console.log(`✅ ${configFileName} migré avec succès depuis: ${defaultConfigPath}`);
                migrationSuccess = true;
                break;
                
            } catch (readError) {
                console.log(`❌ Fichier non trouvé dans: ${defaultConfigPath}`);
                continue;
            }
        }
        
        // Si aucun fichier par défaut n'a été trouvé, crée un fichier avec une structure basique
        if (!migrationSuccess) {
            console.log(`⚠️  Aucun fichier par défaut ${configFileName} trouvé, création d'un fichier avec structure de base`);
            await createDefaultConfigFile(configFileName, userConfigPath);
        }
    }
}

function getDefaultConfigPath(configFileName) {
    // En mode development
    if (!app.isPackaged) {
        return path.join(__dirname, '..', '..', 'config', configFileName);
    }
    
    // En mode production (application empaquetée)
    // Essaie plusieurs emplacements possibles
    const possiblePaths = [
        // Dans resources/app/config (Windows/Linux)
        path.join(process.resourcesPath, 'app', 'config', configFileName),
        // Dans le répertoire de l'application
        path.join(path.dirname(process.execPath), 'resources', 'app', 'config', configFileName),
        // Chemin alternatif
        path.join(__dirname, '..', '..', 'config', configFileName)
    ];
    
    return possiblePaths[0]; // Retourne le premier chemin, on testera l'existence dans migrateConfigFile
}

async function createDefaultConfigFile(configFileName, userConfigPath) {
    let defaultContent = {};
    
    // Crée une structure par défaut selon le type de fichier
    switch (configFileName) {
        case 'cellsConfig.json':
            defaultContent = {
                "cell_example": {
                    "title": "Cellule d'exemple",
                    "description": "Description de la cellule d'exemple"
                }
            };
            break;
            
        case 'mainConfig.json':
            defaultContent = {
                "fullscreen": false,
                "width": 0.8,
                "height": 0.8,
                "port": 3000
            };
            break;
            
        case 'styleConfig.json':
            defaultContent = {
                "first_color": "#ffffff",
                "second_color": "#000000",
                "third_color": "#f0f0f0",
                "font_size": 16
            };
            break;
            
        default:
            defaultContent = {};
    }
    
    await fs.writeFile(userConfigPath, JSON.stringify(defaultContent, null, 2), 'utf-8');
    console.log(`📝 Fichier par défaut ${configFileName} créé`);
}

/**
 * Fonction utilitaire pour vérifier si c'est le premier lancement
 */
async function isFirstLaunch() {
    try {
        const userDataPath = app.getPath('userData');
        const flagFile = path.join(userDataPath, '.initialized');
        
        await fs.access(flagFile);
        return false; // Le fichier existe, ce n'est pas le premier lancement
        
    } catch (error) {
        // Le fichier n'existe pas, c'est le premier lancement
        const userDataPath = app.getPath('userData');
        const flagFile = path.join(userDataPath, '.initialized');
        
        // Crée le fichier flag pour marquer que l'initialisation a été faite
        await fs.writeFile(flagFile, new Date().toISOString(), 'utf-8');
        return true;
    }
}

/**
 * Fonction de debug pour afficher les informations sur les chemins
 */
function debugPaths() {
    console.log('🔍 Informations de debug sur les chemins:');
    console.log('📁 app.isPackaged:', app.isPackaged);
    console.log('📁 process.resourcesPath:', process.resourcesPath);
    console.log('📁 process.execPath:', process.execPath);
    console.log('📁 __dirname:', __dirname);
    console.log('📁 app.getPath("userData"):', app.getPath('userData'));
    console.log('📁 app.getAppPath():', app.getAppPath());
}

module.exports = {
    initializeConfigFiles,
    isFirstLaunch,
    debugPaths
};