// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;

const WAIT_TIME = 3 * 1000;
const BREAK_TIME = 10 * 1000;

ipcRenderer.send('hide-window');

ipcRenderer.on('RESTART_WORK', () => {
    setTimeout(() => {
        ipcRenderer.send('show-window')
    }, WAIT_TIME) // 过等待时间后显示窗口，即工作时间
});

ipcRenderer.on('STOP_WORK', () => {
    setTimeout(() => {
        ipcRenderer.send('hide-window')
    }, BREAK_TIME)// 过休息时间后关闭窗口，即休息时间
});