# Display for chrome cast

Small Electron app that starts a local web server and serves a page of "cells" and text intended to be displayed on Chrome and cast to a Chromecast device.

## Features

- Launches an Electron window and a local HTTP server.
- Serves a simple web UI showing a grid of cells and textual content.
- Designed to be cast from Chrome (tab casting) to a Chromecast on the same network.

## Prerequisites

- Node.js 18+ and npm or yarn
- Chrome browser
- Optional: electron-builder to create distributables

## Quick start

1. Clone repository
2. Install dependencies
    - npm install
3. Start in development
    - npm run start
    - This runs Electron (main) and a local web server (default: <http://localhost:3000>)

## How it works (high level)

- Electron main process:
  - Spawns an Express local HTTP server to serve static assets and an API.
  - Opens a BrowserWindow pointing at the local server URL.
- Renderer (web page):
  - Renders a grid of cells and configurable text.
  - Intended to be cast by using Chrome's "Cast…" → choose your Chromecast (tab casting works without HTTPS).

## Usage

- Open Chrome, go to <http://localhost:3000> (or use the Electron window).
- To show the content on Chromecast:
  - In Chrome: Menu → Cast… → choose "Cast tab" or your device.
  - The page will be mirrored on the Chromecast display.
- Update the content (cells/text) via the application and reload the page on chrome.

## Configuration

- Config file:
  - PORT (default: 3000)
- Ensure Chromecast and host machine are on the same network. If using a different host (0.0.0.0), adjust firewall rules.

## Security notes

- Casting via Chrome tab is safe for local development. Do not expose the server to the public internet without HTTPS and proper authentication.
- Sanitize any user-provided content before rendering.

## Packaging

- Use electron-builder to build installers.
- Ensure the packaged app still starts the local server and serves built static assets.

## License

- MIT License
