const { readdirSync } = require("fs");
const { extname } = require("path");
const chalk = require("chalk");
require('dotenv').config()


exports.fileReader = function () {
    const argv = require('minimist')(process.argv.slice(2));
    const files = readdirSync(__dirname);
    for (const file of files) {
        if (extname(file) === ".json") {
            console.log(chalk.magenta(file));
        } else {
            console.log(file);
            console.log(process.env.EXT.split('.'))
            console.log(argv)
        }
    }
} 
