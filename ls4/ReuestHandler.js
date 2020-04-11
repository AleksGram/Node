const { createWriteStream, createReadStream } = require("fs");
const url = require("url");
const path = require("path");
const { allowedContentTypes } = require("./settings");
const { parseMessage, transformData } = require("./utils");



const messages = [];
let counter = 0;
const date = new Date();


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
                message = { ...message, _id: (date.getTime() + counter++), addedAt: new Date() };
                messages.push(message);
                const storeMessage = createWriteStream("storage.txt");

                storeMessage.write(JSON.stringify(messages));
                res.end()
            })
        }
    },
    getMessages: (req, res, par) => {
        const messages = [];
        const rs = createReadStream(path.join(__dirname, "storage.txt"));
        rs.on("data", chunk => {
            messages.push(chunk);
        })
        rs.on("end", () => {
            if (par.query) {

                const storedData = (messages.toString());
                let result = JSON.parse(storedData);

                Object.keys(parseRequestParams).map(handler => {
                    const params = par.query[handler];
                    if (params) {
                        result = parseRequestParams[handler](result, params);
                    }
                })
                res.end(JSON.stringify(result));
            }
            res.end(messages.toString())
        })
    }
}

const parseRequestParams = {
    sort: (data) => transformData.sortMessages(data),
    skip: (data, param) => transformData.skipMessage(data, param),
    limit: (data, param) => transformData.limitMessage(data, param)
}

