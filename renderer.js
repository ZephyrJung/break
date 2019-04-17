// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const settings = require("./settings");
const title = document.getElementById("title");
const content = document.getElementById("content");
const count = document.getElementById("count");

var time = 30;
setInterval(function () {
    if (time > 0) {
        time = time - 1;
    }
    count.innerText = time;
    title.innerText = settings.messages[time].title;
    content.innerText = settings.messages[time].content;
}, 1000);
