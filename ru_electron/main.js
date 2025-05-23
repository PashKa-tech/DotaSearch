const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const express = require('express');
const http = require('http');

const PORT = 60937;
const server = express();

server.use(express.static(path.join(__dirname, 'build')));
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    icon: path.join(__dirname, 'dota.ico'),
    autoHideMenuBar: true,
    frame: false,  
    transparent: true,
    resizable: false,
    fullscreenable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,  // откл. DevTools
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setIgnoreMouseEvents(false); 
  win.loadURL(`http://localhost:${PORT}`);

  win.webContents.setWindowOpenHandler(({ url }) => {
    const newWin = new BrowserWindow({
      width: 900,
      height: 600,
      autoHideMenuBar: true,
      frame: true,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    newWin.loadURL(url); 
    return { action: 'deny' };
  });

  // IPC события для управления окнами
  ipcMain.on('close-window', () => win.close());
  ipcMain.on('minimize-window', () => win.minimize());
  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
}

let serverRunning = false;

app.whenReady().then(() => {
  if (!serverRunning) {
    http.createServer(server).listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
    serverRunning = true;
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
