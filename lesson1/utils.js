const chalk = require("chalk");

const createExtensionsMap = (extensions, colors) => {
    if (extensions) {
        return extensions.reduce((acc, ext, index) => {
            return {
                ...acc,
                [`.${ext}`]: colors[index] ? colors[index] : 'grey'
            }
        }, {});
    } return {};
};

global.logFile = function (color, file) {
    if (chalk[color]) {
            console.log(chalk[color](file));
    } else {
        console.log(chalk['grey'](file));
    }
}


module.exports = {
    createExtensionsMap,
};