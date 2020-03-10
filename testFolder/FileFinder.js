
const Finder = require("./Finder.js.js");
const os = require('os');


const finder = new Finder("D://", 99, ['.js']);

finder.once("started", () => {
  finder.emit("parse");
})
finder.on("file", file => {
 console.log("Receive file", file);
})
finder.once("processing", data => {
  console.log("Processed data", data);
})
finder.once("finished", () => {
  finder.emit("Parse end");
})