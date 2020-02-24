
const fs = require('fs');
var path = require('path');



/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir 
 * @param {Function} done 
 */
function filewalker(dir, done, depth = 0) {
    let results = [];
    console.log(depth);
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function (file) {


            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {
                var currentDepth = depth;
                // If directory, execute a recursive call
                console.log('curent', currentDepth)
                if (stat && stat.isDirectory() && currentDepth !== null) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                        results.push(file);

                        filewalker(file, function (err, res) {
                            debugger
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        }, (--currentDepth) >= 0 ? currentDepth : null);

                } else {
                    results.push(file);

                    if (!--pending) done(null, results);
                }

            });
        });
    });
};
filewalker(__dirname, function (err, data) {
    if (err) {
        throw err;
    }

    // ["c://some-existent-path/file.txt","c:/some-existent-path/subfolder"]
    console.log(data);
}, 1);