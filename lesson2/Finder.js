const EventEmitter = require("events");
const fs = require('fs');
const { readdir } = require('fs');
const { logger } = require("./logger.js");
var path = require('path');
const { extname } = require("path");

class Finder extends EventEmitter {
    constructor(dirname) {
        super();
        this._dirname = dirname;
        this.timer = null;
        this.files = 0;
        this.folders = 0;
        var _this = this;


        this.on("init", () => {
            console.log("******** - Started - ********** \n");
            _this.timer = setTimeout(() => _this.emit('process'), 1000);
        })

        this.on('files', (files, entity) => {
            console.log('Received files:', files)
            clearTimeout(entity.timer)
        })


        this.on('done', self => {
            clearTimeout(self.timer);
            console.log("******** ##- Finished -## ********** \n")
        })

        this.on('process', () => {
            console.log(`- - - - PROCESSING - - - ${_this.files} files processed in ${_this.folders} folders  \n`)
            _this.timer = setTimeout(() => _this.emit('process'), 1000);
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

            list.forEach(function (file, index) {
                _this.files += 1;
                file = path.resolve(dir, file);

                fs.stat(file, function (err, stat) {

                    if (stat && stat.isDirectory()) {
                        _this.folders += 1;

                        let current = currentDepth ? currentDepth + 1 : 1

                        _this.parse(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) logger(null, results);
                        }, depth, current);


                    } else {
                        const fileExt = extname(file);
                        // results.push(file);

                        if (_this.extensions && _this.extensions.indexOf(fileExt.slice(1)) !== -1) {
                            if (_this.pattern) {
                                let length = file.split('.').length;
                                let fileName = file.split('.').splice(0, length - 1).join('');
                                if (fileName.includes(_this.pattern)) {
                                    results.push(file);

                                    _this.emit('files', file, _this);
                                    _this.timer = setTimeout(() => _this.emit('process'), 1000);

                                }
                            } else {
                                results.push(file);

                                _this.emit('files', file, _this);
                                _this.timer = setTimeout(() => _this.emit('process'), 1000);

                            }
                        }
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


const finder = new Finder('D:/');
finder.setDepth(0)
    .setExtensions(["html"])
    .setPattern('index');
finder.start();
