const electron = require('electron');
const {ipcMain, app, BrowserWindow, Menu, Tray, globalShortcut} = require('electron');
const path = require('path');

let mainWindow;
let appIcon = null;

function createWindow(x, y, width, height) {
    mainWindow = new BrowserWindow({
        x: x,
        y: y,
        width: width,
        height: height,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html')
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', () => {
    let displays = electron.screen.getAllDisplays();
    displays.forEach((d) => {
        createWindow(d.workArea.x, d.workArea.y, d.workArea.width, d.workArea.height)
    });
    const iconPath = path.join(__dirname, "icon.png");
    appIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Remove',
        click: () => {
            event.sender.send('tray-removed');
        }
    }]);
    appIcon.setToolTip('Break Icon in the tray.');
    appIcon.setContextMenu(contextMenu);
    /*    globalShortcut.register("CommandOrControl+Q", () => {
            console.log("quit not allowed");
        });*/
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});

ipcMain.on('asynchronous-message', function (event, arg) {

    if (arg === "ping") {
        mainWindow.hide();
        setTimeout(function () {
            mainWindow.show();
            event.sender.send('asynchronous-reply', 'pong')
        }, 1000)
    }
});

ipcMain.on('remove-tray', () => {
    appIcon.destroy();
});

app.on('window-all-closed', () => {
    if (appIcon) appIcon.destroy();
    // globalShortcut.unregister('CommandOrControl+Q');
});
