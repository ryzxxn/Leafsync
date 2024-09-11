const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'server.js'), // load the preload script
      nodeIntegration: true, // disable node integration for security reasons
      contextIsolation: true, // isolate context
    },
  });

// mainWindow.webContents.on('before-input-event', (event, input) => {
// if (input.key === 'F5' || (input.control && input.key === 'r') || (input.meta && input.key === 'r')) {
//     event.preventDefault(); // Prevent reload
// }
// });

//   uncomment on production
//   mainWindow.loadFile(path.join(__dirname, '/leafsync/index.html'));
  mainWindow.loadURL('http://localhost:5173/');
  mainWindow.webContents.openDevTools();
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Handle IPC from renderer
ipcMain.on('message-to-main', (event, arg) => {
  console.log(arg); // Output the received message from renderer
  event.reply('message-from-main', 'Received your message in the main process!'); // Send reply back to renderer
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
