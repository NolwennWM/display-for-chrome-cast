const express = require('express');
const fs = require('fs');
const path = require('path');
const Config = require('../modules/config');

/**
 * CssRouter class handles dynamic CSS generation based on configuration
 * Provides endpoints for generating CSS variables from style configuration
 */
class CssRouter
{
    /**
     * Creates a new CssRouter instance and initializes routes
     * Sets up Express router and configuration handler for CSS generation
     */
    constructor()
    {
        /** @type {express.Router} Express router instance for CSS routes */
        this.router = express.Router();
        
        /** @type {Config} Configuration handler for reading style settings */
        this.config = new Config();
        
        this.setupRoutes();
    }

    /**
     * Sets up CSS-related routes for the router
     * Configures the variables.css endpoint for dynamic CSS generation
     */
    setupRoutes()
    {
        this.router.get("/variables.css", (req, res) => this.getVariablesCss(req, res));
    }

    /**
     * Generates dynamic CSS variables based on style configuration
     * Reads style config and creates CSS custom properties for colors and font size
     * @param {express.Request} req - Express request object
     * @param {express.Response} res - Express response object
     */
    getVariablesCss(req, res)
    {
        const config = JSON.parse(fs.readFileSync(this.config.getConfigPath('styleConfig.json'), 'utf8'));
        const cssContent = `
    :root {
        --main-color: ${config.first_color};
        --secondary-color: ${config.second_color};
        --third-color: ${config.third_color};
        --font-size: ${config.font_size}px;
    }`;
        res.setHeader('Content-Type', 'text/css');
        res.send(cssContent);
    }

    /**
     * Returns the configured Express router instance
     * @returns {express.Router} The router instance with configured CSS routes
     */
    getRouter()
    {
        return this.router;
    }
}

// Export an instance of the CSS router for use in the main server
module.exports = new CssRouter().getRouter();
