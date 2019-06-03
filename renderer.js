// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;
const moment = require('moment');

setInterval(() => {
        document.getElementById('clock').innerText = moment().format('hh:mm:ss');
    }, 1000
);

let WAIT_TIME = 60 * 60 * 1000;
let BREAK_TIME = 5 * 60 * 1000;

// true表示正在休息，false表示正在工作
let BREAK_FLAG = false;

let wait_loop;
let break_loop;

ipcRenderer.send('HIDE_WINDOW');

ipcRenderer.on('RESTART_WORK', (event,arg) => {
    if (!BREAK_FLAG) {
        return;
    }
    if (!wait_loop) {
        clearTimeout(wait_loop);
    }
    let waitTime = arg;
    if (!waitTime) {
        waitTime = WAIT_TIME;
    }
    BREAK_FLAG = false;
    wait_loop = setTimeout(() => {
        ipcRenderer.send('SHOW_WINDOW')
    }, waitTime) // 过等待时间后显示窗口，即工作时间
});

ipcRenderer.on('STOP_WORK', () => {
    if (BREAK_FLAG) {
        return;
    }
    if (!break_loop) {
        clearTimeout(break_loop);
    }
    BREAK_FLAG = true;
    break_loop = setTimeout(() => {
        ipcRenderer.send('HIDE_WINDOW')
    }, BREAK_TIME);// 过休息时间后关闭窗口，即休息时间
    let current_break_time = BREAK_TIME;
    let break_count = setInterval(() => {
        current_break_time = current_break_time - 1000;
        if (current_break_time <= 0) {
            clearInterval(break_count);
        }
    }, 1000)
});

ipcRenderer.on('SET_WAIT_TIME', (event, arg) => {
    WAIT_TIME = arg;
    if (BREAK_FLAG === false) {
        clearTimeout(wait_loop);
        wait_loop = setTimeout(() => {
            ipcRenderer.send('SHOW_WINDOW')
        }, WAIT_TIME)
    }
});

ipcRenderer.on('SEND_BREAK_TIME', (event, arg) => {
    BREAK_TIME = arg;
    if (BREAK_FLAG === true) {
        clearTimeout(break_loop);
        break_loop = setTimeout(() => {
            ipcRenderer.send('HIDE_WINDOW')
        }, BREAK_TIME)
    }
});