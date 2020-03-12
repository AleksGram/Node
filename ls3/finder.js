const { promises, createReadStream, statSync, createWriteStream } = require("fs");
const { join, relative, extname } = require("path");
const chalk = require("chalk");
const FileType = require('file-type');

const supportedExt = FileType.extensions;

const getTimeMark = () => {
  let ts = Date.now();

  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hh = date_ob.getUTCHours();
  let mm = date_ob.getUTCMinutes();
  let ss = date_ob.getSeconds();
  let ms = date_ob.getTime();

  return `${year}-${month}-${date}_${hh}_${mm}_${ss}`;
}

const logFile = async (file, search) => {
  if (search) {
    let result = null;
    const rs = createReadStream(file, { encoding: "utf-8" })

    for await (let chunk of rs) {
      const startIndex = chunk.indexOf(search);

      if (startIndex >= 0) {
        ws.write(`\n------File: ${file}\n`)
        resultStart = ((startIndex - 20) > 0) ? startIndex - 20 : 0;
        resultEnd = startIndex + 20;
        result = chunk.slice(resultStart, resultEnd);
        ws.write(result);
        console.log(result);
      }
    }
  }
}

global.logFile = function (color, file) {
  if (chalk[color]) {
    console.log(chalk[color](file));
  } else {
    console.log(chalk['grey'](file));
  }
}

const checkFileExt = ext => {
  const ws = createWriteStream(`./${getTimeMark()}.txt`);
  if (supportedExt.has(ext)) {
    return async function (file, search) {
      const rs = createReadStream(file, { start: 0, end: 4100 });
      const buffer = [];

      for await (let chunk of rs) {
        buffer.push(chunk);
      }

      const fileType = await FileType.fromBuffer(Buffer.concat(buffer))
    
      if (fileType && fileType.ext === ext) {
        return true
      }
      return false;
    }
  }
  return async (file, search) => {
    if (extname(file) === `.${ext}`)
    logFile(file, search);
    return extname(file) === `.${ext}`;
  }
}

const verifyPattern = (value, pattern, optional) => {
  if (!pattern) return true;
  const regexStr = `(^${pattern})`;
  if (optional) regexStr + `${optional}?`;
  const regex = new RegExp(regexStr);
  return regex.test(value);
}


const start_parse = (entry_point, max_deep, ext, search, searchOptions, emitter) => {
  const checkExt = checkFileExt(ext);
  return async function finder(path_name = entry_point, deep = 0, options = searchOptions) {
    const files = [];

    const items = await promises.readdir(path_name, { withFileTypes: true });
    let i = 0;
    for (const item of items) {
      if (item.isFile()) {
        emitter("found:file");
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
