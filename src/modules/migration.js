const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

/**
 * Migration class handles configuration file migration and first-launch setup
 * Copies default configuration files to user directory during initial application launch
 */
class Migration 
{
    /**
     * Initializes configuration files during first application launch
     * Creates user config directory and migrates all required configuration files
     * @returns {Promise<void>} Promise that resolves when initialization is complete
     */
    async initializeConfigFiles() {
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
                'styleConfig.json',
                "mainCellConfig.json"
            ];
            
            for (const configFile of configFiles) {
                await this.migrateConfigFile(configFile, userConfigDir);
            }
            
            console.log('✅ Initialisation des fichiers de configuration terminée');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation des fichiers de configuration:', error);
        }
    }

    /**
     * Migrates a single configuration file from default location to user directory
     * Attempts multiple source paths and creates default content if no source found
     * @param {string} configFileName - Name of the configuration file to migrate
     * @param {string} userConfigDir - Target user configuration directory path
     * @returns {Promise<void>} Promise that resolves when migration is complete
     */
    async migrateConfigFile(configFileName, userConfigDir) 
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
                await this.createDefaultConfigFile(configFileName, userConfigPath);
            }
        }
    }

    /**
     * Determines the default configuration file path based on packaging mode
     * Returns different paths for development vs production environments
     * @param {string} configFileName - Name of the configuration file
     * @returns {string} Path to the default configuration file
     */
    getDefaultConfigPath(configFileName) {
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
        
        return possiblePaths[0]; // Returns first path, existence will be tested in migrateConfigFile
    }

    /**
     * Creates a default configuration file with predefined content structure
     * Generates appropriate default values based on configuration file type
     * @param {string} configFileName - Name of the configuration file to create
     * @param {string} userConfigPath - Full path where the file should be created
     * @returns {Promise<void>} Promise that resolves when file is created
     */
    async createDefaultConfigFile(configFileName, userConfigPath) {
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
     * Utility function to check if this is the first application launch
     * Creates initialization flag file and returns launch status
     * @returns {Promise<boolean>} True if first launch, false if already initialized
     */
    async isFirstLaunch() {
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
     * Debug function to display path information for troubleshooting
     * Logs various Electron application paths and packaging status
     */
    debugPaths() {
        console.log('🔍 Informations de debug sur les chemins:');
        console.log('📁 app.isPackaged:', app.isPackaged);
        console.log('📁 process.resourcesPath:', process.resourcesPath);
        console.log('📁 process.execPath:', process.execPath);
        console.log('📁 __dirname:', __dirname);
        console.log('📁 app.getPath("userData"):', app.getPath('userData'));
        console.log('📁 app.getAppPath():', app.getAppPath());
    }
}

module.exports = Migration;