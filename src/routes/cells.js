const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getConfigPath } = require('../modules/config');

router.get("/", (req, res) => {
    const dataPath = getConfigPath('cellsConfig.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier JSON :", err);
            return res.status(500).send("Erreur serveur");
        }
        const cells = JSON.parse(data);
        res.json(cells);
    });
});

module.exports = router;