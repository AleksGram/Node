const { readdirSync } = require("fs");
const { extname } = require("path");
require('dotenv').config()

const { createExtensionsMap } = require("./utils.js");
const { startLog } = require('./parser.js');



exports.logger = function () {
    const argv = require('minimist')(process.argv.slice(2));
    const colors = argv._;
    const deepLevelOfSearch = argv.deep ? argv.deep : null;
    const extensions = process.env.EXT ? process.env.EXT.split(',') : null;


    const filesMap = createExtensionsMap(extensions, colors);

    const others = [];

    const handleMatchFile = function (files) {
        files.map(file => {
            const fileExt = extname(file);
            if (filesMap[fileExt]) {
                logFile(filesMap[fileExt], file)
            } else {
                if (others.indexOf(fileExt) === -1) {
                    others.push(fileExt);
                }
            }
        })
    }

    startLog(deepLevelOfSearch, process.env.FILE_PATH || __dirname)
        .find((err, files) => {
            handleMatchFile(files);
            if (others.length) {
                console.log(`**********  Not muched extensions *********`);
                others.map(ext => console.log(ext));
            }
        });

}



