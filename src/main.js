const { app } = require('electron');
const Window = require('./modules/window');
const ConfigIPC = require('./ipc/config');
const BrowserIPC = require('./ipc/browser');
const CellsIPC = require('./ipc/cells');
const ImagesIPC = require('./ipc/images');
const Migration = require('./modules/migration');

/**
 * Main class serves as the entry point and orchestrator for the Electron application
 * Manages application lifecycle, window creation, IPC registration, and configuration migration
 */
class Main
{
  /**
   * Creates a new Main application instance and initializes all components
   * Sets up window management, IPC handlers, migration system, and Electron event listeners
   */
  constructor()
  {
    // Initialize all class instances
    /** @type {Window} Window management instance */
    this.window = new Window();
    
    /** @type {ConfigIPC} Configuration IPC handler */
    this.configIPC = new ConfigIPC();
    
    /** @type {BrowserIPC} Browser operations IPC handler */
    this.browserIPC = new BrowserIPC();
    
    /** @type {CellsIPC} Cells management IPC handler */
    this.cellsIPC = new CellsIPC();
    
    /** @type {ImagesIPC} Images operations IPC handler */
    this.imagesIPC = new ImagesIPC();
    
    /** @type {Migration} Configuration migration handler */
    this.migration = new Migration();

    // Démarre le serveur local
    require('./server');

    // Configuration des événements Electron
    app.whenReady().then(() => this.openApp());
    app.on('window-all-closed', () => this.closeApp());
  }

  /**
   * Opens and initializes the application
   * Handles first-launch detection, configuration migration, window creation, and IPC registration
   * @returns {Promise<void>} Promise that resolves when application is fully initialized
   */
  async openApp()
  {
    try {
      // Affiche les informations de debug sur les chemins
      this.migration.debugPaths();
      
      // Vérifie si c'est le premier lancement et initialise les fichiers de config si nécessaire
      const firstLaunch = await this.migration.isFirstLaunch();
      if (firstLaunch) 
      {
        console.log('🚀 Premier lancement détecté, initialisation des fichiers de configuration...');
        await this.migration.initializeConfigFiles();
      } else 
      {
        console.log('✅ Application déjà initialisée, pas de migration nécessaire');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de l\'application:', error);
      
    }
    finally 
    {
      console.log('Application prête');
      this.window.createWindow(); 
      this.configIPC.registerConfigIPC();
      this.browserIPC.registerBrowserIPC();
      this.cellsIPC.registerCellsIPC();
      this.imagesIPC.registerImagesIPC();
    }
  }

  /**
   * Handles application closure
   * Implements platform-specific quit behavior (preserves app on macOS, quits on other platforms)
   */
  closeApp() 
  {
    // Sur macOS, il est courant que les applications restent actives jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
    if (process.platform !== 'darwin') app.quit();
  }
}

// Instantiate and start the main Electron application
new Main();
