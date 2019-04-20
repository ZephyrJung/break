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
                type: "radio",
                checked: true,
                click: () => {
                    mainWindows[0].webContents.send('SET_WAIT_TIME', 5 * 1000);
                }
            },
            {
                label: "30 分钟",
                type: "radio",
                click: () => {
                    mainWindows[0].webContents.send('SET_WAIT_TIME', 30 * 60 * 1000);
                }
            },
            {
                label: "1小时",
                type: "radio",
                click: () => {
                    mainWindows[0].webContents.send('SET_WAIT_TIME', 60 * 60 * 1000);
                }
            }, {
                label: "2小时",
                type: "radio",
                click: () => {
                    mainWindows[0].webContents.send('SET_WAIT_TIME', 2 * 60 * 60 * 1000);
                }
            }],
    }, {
        label: "休息时长",
        submenu: [{
            label: "3 秒钟(TEST)",
            type: "radio",
            checked: true,
            click: () => {
                mainWindows[0].webContents.send('SEND_BREAK_TIME', 3 * 1000);
            }
        }, {
            label: "30 秒",
            type: "radio",
            click: () => {
                mainWindows[0].webContents.send('SEND_BREAK_TIME', 30 * 1000);
            }
        }, {
            label: "1 分钟",
            type: "radio",
            click: () => {
                mainWindows[0].webContents.send('SEND_BREAK_TIME', 60 * 1000);
            }
        }, {
            label: "5 分钟",
            type: "radio",
            click: () => {
                mainWindows[0].webContents.send('SEND_BREAK_TIME', 5 * 60 * 1000);
            }
        }]
    },{
        label: "退出",
        click: ()=>{
            app.quit();
        }
    }]);
    appIcon.setToolTip('Break Icon in the tray.');
    appIcon.setContextMenu(contextMenu);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('hide-window', function (event, arg) {
    globalShortcut.unregister('CommandOrControl+Q');
    globalShortcut.unregister('CommandOrControl+W');
    mainWindows.forEach(function (value, index) {
        value.hide();
    });
    event.sender.send('RESTART_WORK');
});

ipcMain.on('show-window', (event) => {
    globalShortcut.register("CommandOrControl+Q", () => {
    });
    globalShortcut.register("CommandOrControl+W", () => {
    });
    mainWindows.forEach(function (value, index) {
        value.show();
    });
    event.sender.send('STOP_WORK');
});

app.on('window-all-closed', () => {
    if (appIcon) appIcon.destroy();
});
