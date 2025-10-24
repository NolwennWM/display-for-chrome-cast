const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get("/variables.css", (req, res) => {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'styleConfig.json'), 'utf8'));
    const cssContent = `
    :root {
        --main-color: ${config.first_color};
        --secondary-color: ${config.second_color};
        --third-color: ${config.third_color};
    }`;
    res.setHeader('Content-Type', 'text/css');
    res.send(cssContent);

});

module.exports = router;
