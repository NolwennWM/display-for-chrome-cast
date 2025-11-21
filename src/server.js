const express = require('express');
const path = require('path');
const { app: electronApp } = require('electron');

/**
 * Server class manages the Express web server for the application
 * Handles static file serving, API routes, and middleware configuration
 */
class Server
{
  /**
   * Creates a new Server instance and starts it automatically
   * Sets up Express application with middleware, routes, and starts listening
   * @param {number} port - Port number to listen on (defaults to 3000)
   */
  constructor(port = 3000)
  {
    /** @type {express.Application} Express application instance */
    this.app = express();
    
    /** @type {number} Server port number */
    this.port = port;
    
    this.setupMiddleware();
    this.setupRoutes();
    this.start();
  }

  /**
   * Sets up Express middleware for the application
   * Configures JSON parsing and static file serving for public files and uploads
   */
  setupMiddleware()
  {
    this.app.use(express.json());

    // Servir le dossier "public"
    this.app.use(express.static(path.join(__dirname, "..", 'public')));
    this.app.use("/uploads", express.static(path.join(electronApp.getPath("userData"), 'images')));
  }

  /**
   * Sets up API routes for the application
   * Configures routes for cells API and CSS generation endpoints
   */
  setupRoutes()
  {
    this.app.use('/api/cells', require('./routes/cells'));
    this.app.use("/css", require("./routes/css"));
  }

  /**
   * Starts the Express server on the configured port
   * Begins listening for incoming HTTP requests and logs server status
   */
  start()
  {
    this.app.listen(this.port, () => {
      console.log(`Serveur lancé sur http://localhost:${this.port}`);
    });
  }
}

// Automatically instantiate and start the server
new Server();
