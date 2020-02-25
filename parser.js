const FileHound = require('filehound');
const fs = require('fs');
var path = require('path');



exports.startLog = (depth, path) => {
    const filesLogger = FileHound.create()
        .paths(path)
     return depth ? filesLogger.depth(depth) : filesLogger
}


function parseFile(dir, logger, depth) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return logger(err);

        var pending = list.length;

        if (!pending ) return logger(null, results);

        if (depth < 0) return logger(null, results);

        list.forEach(function (file) {
            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {

                if (stat && stat.isDirectory()) {

                    let nextDepth = (depth !== undefined) ? depth -1 : undefined;

                    parseFile(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) logger(null, results);
                    }, nextDepth);


                } else {
                    results.push(file);
                    if (!--pending) logger(null, results);
                }

            });
        });
    });
};

exports.parseFiles = (path, logger, depth) => {
    parseFile(path, logger, depth);
}
