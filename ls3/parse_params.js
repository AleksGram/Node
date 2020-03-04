const { homedir } = require("os");
const { env, argv, platform } = process;
const ARG = require("minimist")(argv.slice(2));
require('dotenv').config()

let HOME = homedir();
if (platform === "win32") {
  HOME = HOME.replace(/\\/g, "\\\\");
}

const default_colors = JSON.stringify(["red", "green", "blue"]);
debugger

exports.colors = ARG._ || default_colors;
exports.start_path = env.SEARCH_PATH || HOME;
exports.deep = parseInt(ARG.deep || "0");
exports.search = ARG.search || "";
exports.ext = ARG.name.split('.')[1];
