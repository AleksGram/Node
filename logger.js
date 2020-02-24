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

    const others = [];

    const handleMatchFile = function (files) {
        const colorsLenght = colors.length;
        let currentColor = 0;
        files.map((file, index) => {
            const fileExt = extname(file);

            if (extensions.indexOf(fileExt.slice(1)) !== -1) {
                logFile(colors[currentColor], file);
                if ((currentColor += 1) < colorsLenght) {
                    currentColor = currentColor;
                } else currentColor = 0;
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



