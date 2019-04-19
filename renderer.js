// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;
const settings = require("./settings");

const title = document.getElementById("title");
const content = document.getElementById("content");
const count = document.getElementById("count");

const WAIT_TIME = 3 * 1000;
const BREAK_TIME = 10 * 1000;

var waitTime = WAIT_TIME;
var breakTime = BREAK_TIME; //5 * 60 * 1000
// var breakFlag = false;

ipcRenderer.send('hide-window');

/*while (breakFlag) {
    breakTime = breakTime - 1000;
    count.innerText = breakTime;
    title.innerText = settings.messages[breakTime].title;
    content.innerText = settings.messages[breakTime].content;
}*/

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