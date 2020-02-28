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
    const colors = argv._;

    const others = [];

    return handleMatchFile = function (error, files) {
        if (error) throw error;

        const colorsLenght = colors.length;
        let currentColor = 0;
        files.map((file, index) => {
            const fileExt = extname(file);
                // if (extensions && extensions.indexOf(fileExt.slice(1)) !== -1) {
                    logFile(colors[currentColor], file);
                    // cb.emit("files", file);
                    if ((currentColor += 1) < colorsLenght) {
                        currentColor = currentColor;
                    } else currentColor = 0;
                // } else {
                //     if (others.indexOf(fileExt) === -1) {
                //         others.push(fileExt);
                //     }
                // }
        })
        if (others.length) {
            console.log(`**********  Not muched extensions *********`);
            others.map(ext => console.log(ext));
        }
        cb.emit('done', cb);
        clearTimeout(cb.timer);
    }
}

