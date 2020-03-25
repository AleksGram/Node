const http = require("http");
const fs = require("fs");
const path = require("path");
const { parse } = require("querystring");
const FileType = require('file-type');
const url = require("url");
const { checkContentType } = require("./utils");

const PATH_INDEX = "messages.html";

const allowedContentTypes = {
    "urlencode": "application/x-www-form-urlencoded",
    ".json": "application/json",
    ".js": "text/javascript",
    ".html": "text/html"
};



const getContent = async ({ req, res }, par) => {
    par = (par === '/') ? PATH_INDEX : par;
    const filePath = path.join(__dirname, par);
    let contentType = null;

    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
        res.end("<h1>404</h1>");
        return;
    }
    console.log(filePath)

    contentType = await checkContentType(filePath, allowedContentTypes);

    if (contentType) {
            res.setHeader("Content-Type", contentType);

    const rs = fs.createReadStream(filePath);
    rs.pipe(res);
    } else {
        res.end("Not supportable format");
        return;
    }    
}

const routing = {
    "/": getContent,
    "/assets": getContent,
    "/client.js": getContent,
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