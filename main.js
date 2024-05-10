const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');

app.whenReady().then(() => {
  createWindows();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindows();
    }
  });
});

function createWindows() {
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    minHeight: 720,
    minWidth: 1280,
    // autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'server.js'),
      contextIsolation: false,
      webSecurity: false,
    },
    show: false,
  });
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  mainWindow.loadURL('http://localhost:5173/')
  mainWindow.on('ready-to-show', () => mainWindow.show());
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});