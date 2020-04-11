const { extname } = require("path");
const chalk = require("chalk");


global.logFile = function (color, file) {
    if (chalk[color]) {
        console.log(chalk[color](file));
    } else {
        console.log(chalk['grey'](file));
    }
}

exports.logger = function (extensions, cb) {
    const argv = require('minimist')(process.argv.slice(2));

    return handleMatchFile = function (error, files) {
        if (error) throw(error);

        // if you need some how handle the results
        // put your code here

        // files.map(file => {

        // })
        
        cb.emit('finished', cb);
        clearTimeout(cb.timer);
    }
}

