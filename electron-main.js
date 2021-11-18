const { app, BrowserWindow } = require('electron')
const { startServer, shutDownServer } = require('./backend/src/index')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    win.loadFile('./frontend/dist/frontend/index.html');
}

app.whenReady().then(() => {
    createWindow();
    startServer();
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    shutDownServer();
})