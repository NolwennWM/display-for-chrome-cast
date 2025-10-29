const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getConfigPath } = require('../modules/config');

router.get("/variables.css", (req, res) => {
    const config = JSON.parse(fs.readFileSync(getConfigPath('styleConfig.json'), 'utf8'));
    const cssContent = `
    :root {
        --main-color: ${config.first_color};
        --secondary-color: ${config.second_color};
        --third-color: ${config.third_color};
        --font-size: ${config.font_size}px;
    }`;
    res.setHeader('Content-Type', 'text/css');
    res.send(cssContent);

});

module.exports = router;
