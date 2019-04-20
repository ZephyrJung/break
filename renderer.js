// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;

var WAIT_TIME = 5 * 1000;
var BREAK_TIME = 3 * 1000;

// true表示正在休息，false表示正在工作
var BREAK_FLAG = false;

var wait_loop;
var break_loop;

ipcRenderer.send('hide-window');

ipcRenderer.on('RESTART_WORK', () => {
    BREAK_FLAG = false;
    wait_loop = setTimeout(() => {
        ipcRenderer.send('show-window')
    }, WAIT_TIME) // 过等待时间后显示窗口，即工作时间
});

ipcRenderer.on('STOP_WORK', () => {
    BREAK_FLAG = true;
    break_loop = setTimeout(() => {
        ipcRenderer.send('hide-window')
    }, BREAK_TIME)// 过休息时间后关闭窗口，即休息时间
});

ipcRenderer.on('SET_WAIT_TIME', (event, arg) => {
    WAIT_TIME = arg;
    if (BREAK_FLAG === false) {
        clearTimeout(wait_loop);
        wait_loop = setTimeout(() => {
            ipcRenderer.send('show-window')
        }, WAIT_TIME)
    }
});

ipcRenderer.on('SEND_BREAK_TIME', (event, arg) => {
    BREAK_TIME = arg;
    if (BREAK_FLAG === true) {
        clearTimeout(break_loop);
        break_loop = setTimeout(() => {
            ipcRenderer.send('hide-window')
        }, BREAK_TIME)
    }
});