const { app, BrowserWindow } = require('electron')
const url = require("url");

const createWindow = () => {
    const win = new BrowserWindow({
        show: false,
        // autoHideMenuBar: true,
    })
    win.maximize();
    win.show();

    win.loadFile(`${ __dirname}/frontend/dist/frontend/index.html`)
}

app.whenReady().then(() => {
    createWindow();
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})