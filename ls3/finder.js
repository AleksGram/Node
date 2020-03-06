const { promises, createReadStream, statSync } = require("fs");
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

const checkFileExt = ext => {
  if (supportedExt.has(ext)) {
    return async function (file, search) {
      const rs = createReadStream(file, { start: 0, end: 4100 });
      const buffer = [];

      for await (let chunk of rs) {
        buffer.push(chunk);
      }

      const fileType = await FileType.fromBuffer(Buffer.concat(buffer))

      if (fileType) {
        return fileType.ext === ext;
      }

      return false;
    }
  }

  return async (file, search) => {
    if (extname(file) === `.${ext}`)

      if (search) {
        let result = null;
        const rs = createReadStream(file, {encoding: "utf-8"});
        for await (let chunk of rs) {
          const searchItemLength = search.length;
          const startIndex = chunk.indexOf(search);

          if (startIndex >= 0) {
            resultStart = ((startIndex - 20) > 0)? startIndex - 20 : 0;
            resultEnd = startIndex + 20;
            result = chunk.slice(resultStart, resultEnd);
            console.log('start \n');
            console.log(result);
            console.log('\n end ');

          }
        }
      }

      return extname(file) === `.${ext}`;
  }
}

//{ pattern: 'fin', optional: 'd', rest: '*' }

const verifyPattern = (value, pattern, optional) => {
  if (value.startsWith(pattern)) {
    return true;
  } else if (optional) {
    return value.startsWith(pattern + optional);
  }
  return false;
}


const start_parse = (entry_point, max_deep, ext, search, searchOptions, emitter) => {
  debugger
  const checkExt = checkFileExt(ext);
  return async function finder(path_name = entry_point, deep = 0, options=searchOptions) {
    // const { pattern, optional, rest } = options;
    const files = [];

    const items = await promises.readdir(path_name, { withFileTypes: true });
    let i = 0;
    for (const item of items) {
      if (item.isFile()) {
        emitter("found:file");
        // if (!search || (search && item.name.includes(search))) {
        if (options) {
          const { pattern, optional, rest } = options;


          if (verifyPattern(item.name, pattern, optional)) {

            if (await checkExt(`${path_name}\\${item.name}`, search)) {
              const relative_path = relative(
                entry_point,
                join(path_name, item.name)
              );
              files.push(relative_path);
              emitter("file", relative_path);
            }
          }
        }
        // }
      } else if (item.isDirectory()) {
        emitter("found:dir");
        if (deep < max_deep || max_deep === 0) {
          const new_path = join(path_name, item.name);
          files.push(...(await finder(new_path, deep + 1, options)));
        }
      }
    }

    return files;
  };
};

module.exports = start_parse;
