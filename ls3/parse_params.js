const { homedir } = require("os");
const { env, argv, platform } = process;
const ARG = require("minimist")(argv.slice(2));
require('dotenv').config()

let HOME = homedir();
if (platform === "win32") {
  HOME = HOME.replace(/\\/g, "\\\\");
}

const default_colors = JSON.stringify(["red", "green", "blue"]);

const setUpSearchParam = (searchArg) => {
  let optional = null;
  let lastArg = searchArg.slice(-1);
  let rest = (lastArg === '*') ? lastArg : null;
  let pattern = rest ? searchArg.slice(0, -1) : searchArg;
  let optionalIndex = pattern.indexOf('?');
  if(optionalIndex !== -1) {
     optional = pattern[optionalIndex -1];
     pattern = pattern.slice(0, optionalIndex -1);
  }
  return {
    pattern,
    optional,
    rest,
  }
} 

exports.colors = ARG._ || default_colors;
exports.start_path = env.SEARCH_PATH || HOME;
exports.deep = parseInt(ARG.deep || "0");
exports.search = ARG.search || "";
exports.ext = (ARG.name && ARG.name.split('.')[1]) || 'js';
exports.options = ARG.name && setUpSearchParam(ARG.name.split('\\')[0]);
