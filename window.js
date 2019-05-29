const {BrowserWindow} = require('electron');

module.exports = function (page, x, y, width, height) {
    let window = new BrowserWindow({
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
        },
        transparent: true
    });
    window.loadFile(page);
    window.on('closed', function () {
        window = null
    });
    // window.webContents.closeDevTools();
    return window;
};