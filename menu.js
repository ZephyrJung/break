const {app, Menu} = require('electron');
const loginItemSettings = app.getLoginItemSettings();
const openAtLogin = loginItemSettings.openAtLogin;
module.exports = function (mainWindow) {
    return Menu.buildFromTemplate([{
        label: '休息间隔',
        submenu: [
           /* {
                id: 0,
                label: "5 秒(TEST)",
                type: "radio",
                checked: true,
                click: () => {
                    mainWindow.webContents.send('SET_WAIT_TIME', 5 * 1000);
                }
            },*/
            {
                id: 1,
                label: "30 分钟",
                type: "radio",
                click: () => {
                    mainWindow.webContents.send('SET_WAIT_TIME', 30 * 60 * 1000);
                }
            },
            {
                id: 2,
                label: "1小时",
                type: "radio",
                checked: true,
                click: () => {
                    mainWindow.webContents.send('SET_WAIT_TIME', 60 * 60 * 1000);
                }
            }, {
                id: 3,
                label: "2小时",
                type: "radio",
                click: () => {
                    mainWindow.webContents.send('SET_WAIT_TIME', 2 * 60 * 60 * 1000);
                }
            }],
    }, {
        label: "休息时长",
        submenu: [
            /*{
                label: "3 秒钟(TEST)",
                type: "radio",
                checked: true,
                click: () => {
                    mainWindows[0].webContents.send('SEND_BREAK_TIME', 3 * 1000);
                }
            }, */{
                label: "30 秒",
                type: "radio",
                click: () => {
                    mainWindow.webContents.send('SEND_BREAK_TIME', 30 * 1000);
                }
            }, {
                label: "1 分钟",
                type: "radio",
                click: () => {
                    mainWindow.webContents.send('SEND_BREAK_TIME', 60 * 1000);
                }
            }, {
                label: "5 分钟",
                type: "radio",
                checked: true,
                click: () => {
                    mainWindow.webContents.send('SEND_BREAK_TIME', 5 * 60 * 1000);
                }
            }]
    }, {
        label: "开机启动",
        type: "checkbox",
        checked: openAtLogin,
        click: () => {
            app.setLoginItemSettings({openAtLogin: !openAtLogin})
        }
    }, {
        label: "退出",
        click: () => {
            app.quit();
        }
    }]);
};
