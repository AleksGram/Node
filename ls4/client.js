const p = document.getElementById("content");
p.style.color = "red";
const list = document.getElementById("messageList");

function addMessage(data) {
    for(let message of data) {
        const liEl = document.createElement("li");
        liEl.textContent = `${message.sender}: ${message.text}`;
        list.appendChild(liEl);
    }
}

fetch("/messages")
    .then(data => {
       return data.json();
    })
    .then(addMessage)