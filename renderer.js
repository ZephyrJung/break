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
var breakFlag = false;

while (breakFlag) {
    breakTime = breakTime - 1000;
    count.innerText = breakTime;
    title.innerText = settings.messages[breakTime].title;
    content.innerText = settings.messages[breakTime].content;
}

setInterval(() => {
    ipcRenderer.send('show-window');
    breakFlag = true;
    setTimeout(() => {
        ipcRenderer.send('hide-window', 'ping');
        breakFlag = false;
        breakTime = BREAK_TIME;
    }, breakTime)
    //todo 待参数化
}, waitTime);

ipcRenderer.on('SET_TIME', (event, arg) => {
    console.log(arg);
    time = arg
});