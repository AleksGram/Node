// const p = document.getElementById("content");
// p.style.color = "red";
const list = document.getElementById("messageList");
const form = document.getElementById("form");
const msg = document.getElementById("msg")
const sender = document.getElementById("sender")
const btn = document.getElementById("sent");
let messages = null;
function mergeMessages(msgArray) {
    const newMsg = [];
    if (!messages) {
        messages = msgArray;
        return
    } else {
        msgArray.map(msg => {
            if (!messages.find(({ _id }) => msg._id === _id)) {
                messages.push(msg)
                newMsg.push(msg);
            }
        })
    }
    return newMsg;
}


function sentMessage() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/messages", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("Finished");
            msg.value = "";
            sender.value = "";
            fetch("/messages")
                .then(data => {
                    return data.json();
                })
                .then(addMessage)
        }
    }
    const reqData = {
        text: msg.value,
        sender: sender.value
    }
    xhr.send(JSON.stringify(reqData));
};

btn.addEventListener("click", sentMessage);


function addMessage(data) {
    const nMessages = mergeMessages(data);
    for(let message of nMessages || messages) {
        const liEl = document.createElement("li");
        liEl.innerHTML = `<span class="msgId">ID: ${message._id}</span>${message.sender}: ${message.text} `;
        list.appendChild(liEl);
    }
}



fetch("/messages")
    .then(data => {
        return data.json();;
    })
    .then(addMessage)