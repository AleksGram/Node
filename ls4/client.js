const p = document.getElementById("content");
p.style.color = "red";
const list = document.getElementById("messageList");
const form = document.getElementById("form");
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
            fetch("/messages")
                .then(data => {
                    return data.json();
                })
                .then(addMessage)
        }
    }

    xhr.send(JSON.stringify({ text: "My text", sender: "Me" }))
};

btn.addEventListener("click", sentMessage);


function addMessage(data) {
    const nMessages = mergeMessages(data);
    console.log(data);
    console.log(messages);
    for(let message of nMessages || messages) {
        const liEl = document.createElement("li");
        liEl.textContent = `${message.sender}: ${message.text} ID: ${message._id}`;
        list.appendChild(liEl);
    }
}



fetch("/messages")
    .then(data => {
        return data.json();;
    })
    .then(addMessage)