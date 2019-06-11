const electron = require('electron');
const {ipcMain, app, Tray, globalShortcut} = require('electron');
const path = require('path');
const contextMenu = require('./menu');
const window = require('./window');

let mainWindows = [];
let appIcon = null;

const iconPath = path.join(__dirname, "icon.png");

function createWindow(x, y, width, height) {
    mainWindows.push(window("index.html", x, y, width, height));
}

app.on('ready', () => {
    console.log("app ready");
    let displays = electron.screen.getAllDisplays();
    displays.forEach((d) => {
        // createWindow(d.workArea.x + d.workArea.width / 2 - 400, d.workArea.y + d.workArea.height / 2 - 300, 800, 600)
        createWindow(d.workArea.x, d.workArea.y, d.workArea.width, d.workArea.height)
    });
    appIcon = new Tray(iconPath);
    appIcon.setToolTip('Break Icon in the tray.');
    appIcon.setContextMenu(contextMenu(mainWindows[0]));
});

app.on('window-all-closed', function () {
    console.log("app window-all-closed");
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('HIDE_WINDOW', function (event, arg) {
    console.log("ipcMain HIDE_WINDOW");
    globalShortcut.unregister('CommandOrControl+Q');
    globalShortcut.unregister('CommandOrControl+W');
    mainWindows.forEach(function (value, index) {
        value.hide();
    });
    event.sender.send('RESTART_WORK');
});

ipcMain.on('SHOW_WINDOW', (event) => {
    console.log("ipcMain SHOW_WINDOW");
    mainWindows.forEach(function (value, index) {
        value.show();
    });
    event.sender.send('STOP_WORK');
    //跳过本次休息
    globalShortcut.register("CommandOrControl+Q", () => {
    });
    //推迟本次休息5分钟
    globalShortcut.register("CommandOrControl+W", () => {
        mainWindows.forEach(function (value, index) {
            value.hide();
        });
        event.sender.send('RESTART_WORK', /*60 **/ 1000 * 60 * 5);
        globalShortcut.unregister('CommandOrControl+Q');
        globalShortcut.unregister('CommandOrControl+W');
    });
});

app.on('window-all-closed', () => {
    console.log("app window-all-closed");
    if (appIcon) appIcon.destroy();
});
