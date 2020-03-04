const { promises } = require("fs");
const { join, relative, extname } = require("path");
const chalk = require("chalk");
const FileType = require('file-type');

const supportedExt = FileType.extensions;


global.logFile = function (color, file) {
    if (chalk[color]) {
        console.log(chalk[color](file));
    } else {
        console.log(chalk['grey'](file));
    }
}

const checkFileExt  = ext => {
  if (supportedExt.has(ext)) {
    return async function (file) {
      console.log('extension---\n');

      const ext = await FileType.fromFile(file);
      console.log(ext);
      // console.log(await FileType.fromFile(file));
      console.log('\n--extension---');
      // return await FileType.fromFile(file).ext;
    }
  } 
  return (file) => {
    console.log('extension---\n');
    console.log(extname(file));
    console.log('\n--extension---');

  }
}

const start_parse = (entry_point, max_deep, ext, search, emitter) => {
  const checkExt = checkFileExt(ext);
  return async function finder(path_name = entry_point, deep = 0) {
    const files = [];
    const items = await promises.readdir(path_name, { withFileTypes: true });
    let i = 0;
    for (const item of items) {
      if (item.isFile()) {
        emitter("found:file");
        debugger
        // if (!search || (search && item.name.includes(search))) {
          
          const relative_path = relative(
            entry_point,
            join(path_name, item.name)
          );
          files.push(relative_path);
          debugger
          checkExt(`${path_name}\\${item.name}`);
          // try {
          //   console.log(await FileType.fromFile(`${path_name}\\${item.name}`));
          // } catch(err) {
          //   console.error(err);
          // }
          emitter("file", relative_path);
        // }
      } else if (item.isDirectory()) {
        emitter("found:dir");
        if (deep < max_deep || max_deep === 0) {
          const new_path = join(path_name, item.name);
          files.push(...(await finder(new_path, deep + 1)));
        }
      }
    }

    return files;
  };
};

module.exports = start_parse;
