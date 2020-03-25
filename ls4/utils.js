const { createReadStream } = require("fs");
const FileType = require('file-type');
const path = require("path");



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

