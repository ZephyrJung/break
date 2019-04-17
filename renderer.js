// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const settings = require("./settings");
const title = document.getElementById("title");
const content = document.getElementById("content");
const count = document.getElementById("count");

title.innerText = settings.messages[0].title;
content.innerText = settings.messages[0].content;
var time = 30;
setInterval(function () {
    time = time - 1;
    count.innerText = time;
    if (time == 0) {
    }
}, 1000);
