const electron = require('electron');
const {ipcMain, app, BrowserWindow, Menu, Tray, globalShortcut} = require('electron');
const path = require('path');

let mainWindows = [];
let appIcon = null;

const iconPath = path.join(__dirname, "icon.png");


function createWindow(x, y, width, height) {
    let mainWindow = new BrowserWindow({
        x: x,
        y: y,
        width: width,
        height: height,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    mainWindows.push(mainWindow);
}

app.on('ready', () => {
    let displays = electron.screen.getAllDisplays();
    displays.forEach((d) => {
        // createWindow(d.workArea.x + d.workArea.width / 2 - 400, d.workArea.y + d.workArea.height / 2 - 300, 800, 600)
        createWindow(d.workArea.x, d.workArea.y, d.workArea.width, d.workArea.height)
    });
    appIcon = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([{
        label: '休息间隔',
        submenu: [
            {
                label: "5 秒(TEST)",
                click: () => {
                    mainWindows[0].webContents.send('SET_TIME', 5 * 1000);
                }
            },
            {
                label: "30 分钟",
                click: () => {
                    mainWindows[0].webContents.send('SET_TIME', 5 * 1000);
                }
            },
            {
                label: "1小时",
                checked: true,
                click: () => {
                    mainWindows[0].webContents.send('SET_TIME', 5 * 1000);
                }
            }, {
                label: "2小时",
                click: () => {
                    mainWindows[0].webContents.send('SET_TIME', 5 * 1000);
                }
            }],
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

ipcMain.on('hide-window', function (event, arg) {
    mainWindows.forEach(function (value, index) {
        value.hide();
    });
    event.sender.send('RESTART_WORK');
});

ipcMain.on('show-window', (event) => {
    mainWindows.forEach(function (value, index) {
        value.show();
    });
    event.sender.send('STOP_WORK');
});

ipcMain.on('SET_TIME', (event, arg) => {
    console.log('click menu ' + arg);
    event.sender.send('SET_TIME', arg)
});

app.on('window-all-closed', () => {
    if (appIcon) appIcon.destroy();
    // globalShortcut.unregister('CommandOrControl+Q');
});
