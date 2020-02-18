const chalk = require("chalk");

const createExtensionsMap = (extensions, colors) => {
    if (extensions) {
        return extensions.reduce((acc, ext, index) => {
            return {
                ...acc,
                [ext]: colors[index] ? colors[index] : 'grey'
            }
        }, {});
    } return {};
};

global.logFile = function (color, file) {
    console.log(chalk[color](file));
}


module.exports = {
    createExtensionsMap,
};