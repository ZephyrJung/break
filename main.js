const electron = require('electron');
const {ipcMain, app, BrowserWindow, Menu, Tray, globalShortcut} = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appIcon = null;

function createWindow(x, y) {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        x: x,
        y: y,
        width: 800,
        height: 600,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    let displays = electron.screen.getAllDisplays();
    displays.forEach((d) => {
        //todo need calculate
        createWindow(d.workArea.x,d.workArea.y);
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

    globalShortcut.register("CommandOrControl+Q", () => {
        console.log("quit not allowed");
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
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
    globalShortcut.unregister('CommandOrControl+Q');
});