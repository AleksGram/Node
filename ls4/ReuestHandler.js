const { createWriteStream, createReadStream } = require("fs");
const path = require("path");
const { allowedContentTypes } = require("./settings");
const {  parseMessage } = require("./utils");



const messages = [];
let counter = 0;


exports.Request = {
    postMessage: (req, res) => {
        const contentType = req.headers["content-type"];
        if (allowedContentTypes.includes(contentType)) {
            let message = "";
            req.on("data", ch => {
                message += ch;
            });
            req.on("end", () => {
                message = parseMessage[contentType](message);
                message = { ...message, _id: counter++, addedAt: new Date() };
                messages.push(message);
                const storeMessage = createWriteStream("storage.txt");
    
                storeMessage.write(JSON.stringify(messages));
                res.end()
            })
        }
    },
    getMessages: (req, res) => {
        const messages = [];
        const rs = createReadStream(path.join(__dirname, "storage.txt"));
        rs.on("data", chunk => {
            messages.push(chunk);
        })
        rs.on("end", () => {
            res.end(messages.toString())
        })
    }
}