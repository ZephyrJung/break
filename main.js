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
