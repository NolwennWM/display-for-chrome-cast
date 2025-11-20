const express = require('express');
const path = require('path');
const { app: electronApp } = require('electron');
const app = express();
const port = 3000;

app.use(express.json());

// Servir le dossier "public"
app.use(express.static(path.join(__dirname, "..", 'public')));
app.use("/uploads", express.static(path.join(electronApp.getPath("userData"), 'images')));

app.use('/api/cells', require('./routes/cells'));
app.use("/css", require("./routes/css"));


app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
