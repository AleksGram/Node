const FileHound = require('filehound');


exports.startLog = (depth, path) => {
    const filesLogger = FileHound.create()
        .paths(path)
     return depth ? filesLogger.depth(depth) : filesLogger
}
