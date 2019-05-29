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
    mainWindows.forEach(function (value, index) {
        value.show();
    });
    event.sender.send('STOP_WORK');
    //跳过本次休息
    globalShortcut.register("CommandOrControl+Q", () => {
        mainWindows.forEach(function (value, index) {
            value.hide();
        });
        event.sender.send('RESTART_WORK');
        globalShortcut.unregister('CommandOrControl+Q');
        globalShortcut.unregister('CommandOrControl+W');
    });
    //推迟本次休息3分钟
    globalShortcut.register("CommandOrControl+W", () => {
        // mainWindows.forEach(function (value, index) {
        //     value.hide();
        // });
        event.sender.send('RESTART_WORK', /*60 **/ 1000 * 3);
        globalShortcut.unregister('CommandOrControl+Q');
        globalShortcut.unregister('CommandOrControl+W');
    });
});

app.on('window-all-closed', () => {
    if (appIcon) appIcon.destroy();
});

app.on('test', (args) => {
    console.log(args[0])
});