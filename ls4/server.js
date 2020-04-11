const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { parse } = require("querystring");
const { Request } = require("./ReuestHandler");
const { checkContentType, Logger, checkQueryParams } = require("./utils");
const { PATH_INDEX, supportedFileTypes } = require("./settings");

const requestLogger = fs.createWriteStream("./Logs/RequestLogger.txt");
const sendFileLogger = fs.createWriteStream("./Logs/SendFileLog.txt");
const messages = [];
let counter = 0;
let query = null;

const sendFile = async ({ req, res }, {url}) => {
    par = (url === '/') ? PATH_INDEX : url;
    const filePath = path.join(__dirname, par);
    let contentType = null;
    let startSending = null;
    let endSending = null;

    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
        const date = new Date();
        endSending = date.getTime();
        const options = {
            date: date.toString(),
            timeSpent: (endSending - startSending) / 1000,
        }
        res.statusCode = 404;
        Logger.logSendFile(sendFileLogger, { req, res }, options)

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

            Logger.logSendFile(sendFileLogger, { req, res }, { date: date.toString() })
        })
        res.once("unpipe", () => {
            const date = new Date();
            endSending = date.getTime();
            const options = {
                date: date.toString(),
                timeSpent: (endSending - startSending) / 1000,
            }
            Logger.logSendFile(sendFileLogger, { req, res }, options)
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
            Request.getMessages(req, res, par);
            return;
    }
};


const routing = {
    "/": sendFile,
    "/assets": sendFile,
    "/client.js": sendFile,
    "/style.css": sendFile,
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

    res.on("finish", () =>Logger.logRequest(client, requestLogger))    

    const parsedUrl = url.parse(req.url, true);
    const queryParams = parsedUrl.query;
    query = checkQueryParams(query, queryParams, parsedUrl.pathname === "/");


    const parsedUrlLength = parsedUrl.pathname.length;
    req.url =
        parsedUrlLength > 1 && parsedUrl.pathname[parsedUrlLength - 1] === "/"
            ? parsedUrl.pathname.slice(0, parsedUrlLength - 1)
            : parsedUrl.pathname;

    let pathParam = req.url.startsWith("/assets") ? "/assets" : req.url;
    route = routing[pathParam];
    if (!route) {
        res.statusCode = 404;
        return client.res.end("404");
    }
    const type = typeof route;
    const renderer = types[type];
    const params = {url: client.req.url, query}
    return renderer(route, client, params);
};


http.createServer((req, res) => {
    router({ req, res });
}).listen(2525);