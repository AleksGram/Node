const { createWriteStream, createReadStream } = require("fs");
const url = require("url");
const path = require("path");
const { allowedContentTypes } = require("./settings");
const { parseMessage } = require("./utils");



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
                    if (par.query[handler]) {
                        result = parseRequestParams[handler](result, par.query[handler]);
                    }
                })

                // sortMessages(result)
                 console.log(result);   
                res.end(JSON.stringify(result));

            }
            res.end(messages.toString())
        })
    }
}

const sortMessages = (messages) => {
    console.log('sort', messages);

    const result = messages.sort((a, b) => {
        return (a.text < b.text) ? -1 : 1  
    })
    return result;
}

const limitMessage = (messages, limitValue) => {
    console.log('limit', messages);
    const result = messages.slice(0, limitValue);
    return result;
}

const skipMessage = (messages, skipValue) => {
    debugger
    console.log('skip', messages);
    const result = messages.slice(Number(skipValue) + 1);
    return result;
}

const parseRequestParams = {
    sort: (data) => sortMessages(data),
    skip: (data, param) => skipMessage(data, param),
    limit: (data, param) => limitMessage(data, param)
}

