const express = require('express');
const fs = require('fs');
const path = require('path');
const Config = require('../modules/config');

/**
 * CellsRouter class handles HTTP routes for cells and main cell configuration
 * Provides REST API endpoints for retrieving cell data and main cell settings
 */
class CellsRouter
{
    /**
     * Creates a new CellsRouter instance and initializes routes
     * Sets up Express router and configuration handler for cells API
     */
    constructor()
    {
        /** @type {express.Router} Express router instance for cells routes */
        this.router = express.Router();
        
        /** @type {Config} Configuration handler for reading cell data files */
        this.config = new Config();
        
        this.setupRoutes();
    }

    /**
     * Sets up all cell-related routes for the router
     * Configures GET endpoints for retrieving cells data and main cell configuration
     */
    setupRoutes()
    {
        this.router.get("/", (req, res) => this.getCells(req, res));
        this.router.get("/main", (req, res) => this.getMainCell(req, res));
    }

    /**
     * Handles GET request to retrieve all cells data
     * Reads cells configuration file and returns JSON data
     * @param {express.Request} req - Express request object
     * @param {express.Response} res - Express response object
     */
    getCells(req, res)
    {
        const dataPath = this.config.getConfigPath('cellsConfig.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) 
            {
                console.error("Erreur de lecture du fichier JSON :", err);
                return res.status(500).send("Erreur serveur");
            }
            const cells = JSON.parse(data);
            res.json(cells);
        });
    }

    /**
     * Handles GET request to retrieve main cell configuration
     * Reads main cell configuration file and returns JSON data
     * @param {express.Request} req - Express request object
     * @param {express.Response} res - Express response object
     */
    getMainCell(req, res)
    {
        const dataPath = this.config.getConfigPath('mainCellConfig.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) 
            {
                console.error("Erreur de lecture du fichier JSON :", err);
                return res.status(500).send("Erreur serveur");
            }
            const mainCellConfig = JSON.parse(data);
            res.json(mainCellConfig);
        });
    }

    /**
     * Returns the configured Express router instance
     * @returns {express.Router} The router instance with configured cells routes
     */
    getRouter()
    {
        return this.router;
    }
}

// Export an instance of the cells router for use in the main server
module.exports = new CellsRouter().getRouter();