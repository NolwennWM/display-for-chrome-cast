const { shell } = require('electron');
const chromeLauncher = require('chrome-launcher');
const path = require('path');
const fs = require('fs').promises;


async function openBrowser() 
{
  try
  {
    const chrome = await chromeLauncher.launch({
        startingUrl: 'http://localhost:3000'
    });
    console.log(`Chrome lancé sur le port ${chrome.port}`);
  }
  catch (err)
  {
    console.warn('Chrome non trouvé, ouverture dans le navigateur par défaut');
    shell.openExternal('http://localhost:3000');
  }
}

async function routeTo(event, pathName)
{
  const filePath = path.join(__dirname, '..', "..", 'app', 'views', pathName + '.html');
  return fs.readFile(filePath, 'utf-8');
}

module.exports = { openBrowser, routeTo };