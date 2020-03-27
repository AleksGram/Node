const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { Request } = require("./ReuestHandler");
const { checkContentType, Logger } = require("./utils");
const { PATH_INDEX, supportedFileTypes } = require("./settings");

const requestLogger = fs.createWriteStream("./Logs/RequestLogger.txt");
const sendFileLogger = fs.createWriteStream("./Logs/SendFileLog.txt");
const messages = [];
let counter = 0;

const sendFile = async ({ req, res }, par) => {
    par = (par === '/') ? PATH_INDEX : par;
    const filePath = path.join(__dirname, par);
    let contentType = null;
    const ws = fs.createWriteStream("./Logs/SendFileLog.txt");
    let startSending = null;
    let endSending = null;

    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
        res.end("<h1>404</h1>");
        return;
    }

    contentType = await checkContentType(filePath, supportedFileTypes);

    if (contentType) {
        res.setHeader("Content-Type", contentType);

        const rs = fs.createReadStream(filePath);
        res.once("pipe", () => {
            const date = new Date();
            startSending = date.getTime();

            Logger.logSendFile(sendFileLogger, req, { date: date.toString() })
        })
        res.once("unpipe", () => {
            const date = new Date();
            endSending = date.getTime();
            const options = {
                date: date.toString(),
                timeSpent: (endSending - startSending) / 1000,
            }
            Logger.logSendFile(sendFileLogger, req, options)
        })
        rs.pipe(res);

    } else {
        res.end("Not supportable format");
        return;
    }
}

const handleMessagesRequest = ({ req, res }, par) => {
    switch (req.method) {
        case "POST":
            Request.postMessage(req, res);
            return;
        case "GET":
            Request.getMessages(req, res);
            return;
    }
};


const routing = {
    "/": sendFile,
    "/assets": sendFile,
    "/client.js": sendFile,
    "/messages": handleMessagesRequest
}

const types = {
    object: JSON.stringify,
    string: s => s,
    number: n => n + '',
    undefined: () => 'not found',
    function: (fn, client, par) => fn(client, par),
};


const router = client => {
    let route = null;
    const { req, res } = client;

    Logger.logRequest(client, requestLogger);

    const parsedUrl = url.parse(req.url, true);
    const parsedUrlLength = parsedUrl.pathname.length;
    req.url =
        parsedUrlLength > 1 && parsedUrl.pathname[parsedUrlLength - 1] === "/"
            ? parsedUrl.pathname.slice(0, parsedUrlLength - 1)
            : parsedUrl.pathname;

    let pathParam = req.url.startsWith("/assets") ? "/assets" : req.url;
    route = routing[pathParam];
    if (!route) {
        //   for (let i = 0; i < matching.length; i++) {
        //     const rx = matching[i];
        //     par = client.req.url.match(rx[0]);
        //     if (par) {
        //       par.shift();
        //       route = rx[1];
        //       break;
        //     }
        //   }
        return client.res.end("404");
    }
    const type = typeof route;
    const renderer = types[type];
    return renderer(route, client, client.req.url);
};


http.createServer((req, res) => {
    router({ req, res });
    // const parsedUrl = url.parse(req.url, true);

    // if (req.url === "/") {
    //     const rs = fs.createReadStream(path.join(__dirname, "messages.html"));
    //     rs.pipe(res);
    // }
    // if(req.url === "/test.js") {
    //     const rs = fs.createReadStream(path.join(__dirname, "test.js"));
    //     rs.pipe(res);
    // }
    // res.end(router({req, res}));
}).listen(2525);