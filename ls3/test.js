const { createReadStream, createWriteStream } = require("fs");
const FileType = require('file-type');

const rs = createReadStream("./download.png", { start: 0, end: 41, encoding: "utf-8" });

const supportedExt = FileType.extensions;

console.log(supportedExt.has('js'))
console.log(supportedExt.has('png'))

// rs.on("open", () =>{
//   console.log("open stream")
// })
// (async () => {
//   for await (let chunk of rs) {
//     console.log( chunk);
//   }
//   //  console.log(await FileType.fromFile("./download.png"))
// })()