const { shell } = require('electron');
const chromeLauncher = require('chrome-launcher');
const e = require('express');


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

module.exports = { openBrowser };