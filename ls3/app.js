const { start_path, deep, ext, search, colors } = require("./parse_params");
let currentColor = 0;



debugger
const colorLog = (...arguments) => {
  const length = colors.length;
  logFile(colors[currentColor], ...arguments);

  if ((currentColor += 1) < length) {
      currentColor = currentColor;
  } else currentColor = 0;
}


const Finder = require("./ee");
const fl = new Finder(start_path, deep, ext, search);
fl.once("started", () => {
  console.log("------Parse start------ \n");
  fl.emit("parse");
});
fl.on("file", file => {
  // console.log("Receive file", file);
  // console.log(FileType.fromFile(file));
  // colorLog(file);
});
fl.on("processing", data => {
  console.log("DATA:", data);
});
fl.once("finished", () => {
  console.log("\n ------Parse end------ ");
});
