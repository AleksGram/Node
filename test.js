
const fs = require('fs');
var path = require('path');
const {parseFiles} = require('./parser.js');

const logger = (err, data) => {
    if (err) throw err;
    console.log(data);
}
parseFiles(__dirname, logger, 2);

// function parseFile(dir, logger, depth) {
//     let results = [];
//     fs.readdir(dir, function (err, list) {
//         if (err) return logger(err);

//         var pending = list.length;

//         if (!pending ) return logger(null, results);

//         if (depth < 0) return logger(null, results);

//         list.forEach(function (file) {
//             file = path.resolve(dir, file);

//             fs.stat(file, function (err, stat) {

//                 // If directory, execute a recursive call
//                 if (stat && stat.isDirectory()) {

//                     let nextDepth = (depth !== undefined) ? depth -1 : undefined;

//                     parseFile(file, function (err, res) {
//                         results = results.concat(res);
//                         if (!--pending) logger(null, results);
//                     }, nextDepth);


//                 } else {
//                     results.push(file);
//                     if (!--pending) logger(null, results);
//                 }

//             });
//         });
//     });
// };


// parseFile(__dirname, function (err, data) {
//     if (err) {
//         throw err;
//     }

//     // ["c://some-existent-path/file.txt","c:/some-existent-path/subfolder"]
//     console.log(data);
// }, 1);