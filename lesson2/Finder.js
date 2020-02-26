const EventEmitter = require("events");
const fs = require('fs');
const { readdir } = require('fs');
const { logger } = require("./logger.js");
var path = require('path');

class Finder extends EventEmitter {
    constructor(dirname) {
        super();
        this._dirname = dirname;

        this.on("init", () => console.log("******** - Started - ********** \n"));

        this.on('files', files => console.log('Received files:', files))

        this.on('done', files =>  console.log("******** ##- Finished -## ********** \n"))

        this.on('tick', files =>  console.log("******** ##- Tik -## ********** \n"))


        setTimeout(() => {
            this.emit("init");
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


    parse(dir, logger, depth) {
        var _this = this;
        let results = [];
        fs.readdir(dir, function (err, list) {
            if (err) return logger(err);

            var pending = list.length;

            if (!pending) return logger(null, results);

            if (depth < 0) return logger(null, results);

            list.forEach(function (file) {
                file = path.resolve(dir, file);

                fs.stat(file, function (err, stat) {

                    if (stat && stat.isDirectory()) {

                        let nextDepth = (depth !== undefined) ? depth - 1 : undefined;

                        _this.parse(file, function (err, res) {
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
    
    start() {
        const log = logger(this.extensions, this);
        this.parse(this._dirname, log, this.depth);
    }

}


const finder = new Finder(__dirname);
finder.setDepth(2)
      .setExtensions(["json"]);
      finder.start();
      console.log(__dirname)