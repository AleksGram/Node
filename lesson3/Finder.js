const EventEmitter = require("events");
const  parser  = require("./parser.js");
const PROCESS_INTERVAL = 10;

class Finder extends EventEmitter {
  constructor(strartPath, maxDeep, extensions, searchPattern) {
    super();
    this._strartPath = strartPath;
    this._maxDeep = maxDeep;
    this._extensions = extensions;
    this._searchPattern = searchPattern;
    this._processedDir = 0;
    this._processedFiles = 0;
    this.timer;

    this.once("parse", this.parse);

    this.on("found:file", this.found.bind(this, "Files"));

    this.once("found:dir", this.found.bind(this, "Dir"));

    this.on("file", this.setTimer)

    this.once("finished", this.clearTimer)

    setTimeout(() => {
      this.emit("started");
    },0);
  }

  parse() {
    this.setTimer();

    parser(
      this._strartPath,
      this._maxDeep,
      this._extensions,
      this._searchPattern,
      this.emit.bind(this)
    )();
    this.emit("finished");
  }

  found(name) {
    this[`_processed ${name}`]++;
  }

  setTimer () {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.emit("processing", {
        dir: this._processedDir,
        files: this._processedFiles
      });
      this.setTimer();
    }, PROCESS_INTERVAL);
  }

  clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}

module.exports = Finder;