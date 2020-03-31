const { createReadStream } = require("fs");
const FileType = require('file-type');
const path = require("path");
const { parse } = require("querystring");
let reqCounter = 0;
const requests = [];
let logTimer = null;





exports.checkContentType = async (filePath, allowedContentTypes) => {
    const rs = createReadStream(filePath, { start: 0, end: 4100 });
    const buffer = [];

    for await (let chunk of rs) {
        buffer.push(chunk);
    }

    fileType = await FileType.fromBuffer(Buffer.concat(buffer))
    return fileType 
            ? fileType.mime 
            : allowedContentTypes[path.extname(filePath)]
}

exports.Logger = {
    logRequest: ({req, res}, ws) => {
        const currentReq = {
            id: reqCounter +=1,
            Client: req.headers['user-agent'].split(' ')[0],
            status: res.statusCode
        };
        requests.push(currentReq);
        // if(!logTimer){
        //     logTimer = setInterval(() => {
        //         console.log("write")
        //     ws.write(JSON.stringify(requests));
        // }, 60000); 
        //} 
    },

    logSendFile: (ws, req, {date, timeSpent}) => {

        if (date && timeSpent) ws.write(`Finished sending: ${date}\n
        Time spent: ${timeSpent} sec
        Status: ${req.aborted ? 'Failed' : "Success"}`)

         if(date) ws.write(`\nStart sending: ${date}\n`)
    }
}

exports.parseMessage = {
    "application/x-www-form-urlencoded": message => parse(message),
    "application/json": message => JSON.parse(message)
};

exports.checkQueryParams = (initValue, params, reinit) => {
    if (reinit) initValue = {};
    const expectParams = ["sort", "limit", "skip"];
    expectParams.map(key => {
        if (params[key] && reinit ) {
            initValue = Object.assign({}, params);
        }
    })
    return initValue;
}