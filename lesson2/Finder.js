const EventEmitter = require("events");
const fs = require('fs');
const { readdir } = require('fs');
const { logger } = require("./logger.js");
var path = require('path');

class Finder extends EventEmitter {
    constructor(dirname) {
        super();
        this._dirname = dirname;
        this.timer = null;


        this.on("init", () => {
            console.log("******** - Started - ********** \n");
        })

        this.on('files', files => {
            console.log('Received files:', files)
        })


        this.on('done', () => {
            console.log("******** ##- Finished -## ********** \n")

        })

        this.on('process', () => {
            console.log("- - - - PROCESSING - - -  \n")
        })

        setTimeout(() => {
            this.emit("init", this);
        }, 0);

    }

    setDepth(depth) {
        this.depth = depth;
        return this;
    }

    setExtensions(ext) {
        this.extensions = ext;
        return this;
    }

    setPattern(pattern) {
        this.pattern = pattern;
        return this;
    }


    parse(dir, logger, depth, currentDepth) {
        var _this = this;
        let results = [];

        fs.readdir(dir, function (err, list) {

            if (err) return logger(err);

            var pending = list.length;


            if (!pending) return logger(null, results);

            if (depth && currentDepth > depth) return logger(null, results);

            list.forEach(function (file) {
                file = path.resolve(dir, file);

                fs.stat(file, function (err, stat) {

                    if (stat && stat.isDirectory()) {

                        let current = currentDepth ? currentDepth + 1 : 1

                        _this.parse(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) logger(null, results);
                        }, depth, current);


                    } else {
                        results.push(file);
                        if (!--pending) logger(null, results);
                    }

                });
            });
        });
    };

    start() {
        const log = logger(this.extensions, this);
        this.parse(this._dirname, log, this.depth);
    }

}


const finder = new Finder(__dirname);
finder.setDepth(1)
    .setExtensions(["js"]);
finder.start();
