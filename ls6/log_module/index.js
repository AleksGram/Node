const { createReadStream, createWriteStream } = require("fs");
const { Logger } = require("../utils/logger");

exports.log_module = (req, res, next) => {
  const logRequest = createWriteStream("./Logs/requestLog.txt", { flags: "a" });
  const logFileSend = createWriteStream("./Logs/sendFilesLog.txt", { flags: "a" });

  const start_time = new Date();
  let finished = false;

  Logger.logSendFile(logFileSend, { req, res }, { date: start_time });

  const finish_listener = () => {
    finished = true;
    const end_time = new Date();
    const timeSpent = ((end_time - start_time) / 1000).toFixed(3);
    Logger.logSendFile(logFileSend, { req, res }, { date: start_time, timeSpent });
    Logger.logRequest({ req, res }, logRequest)
    next()
  };

  res.once("finish", finish_listener)
  res.once("close", () => {
    res.removeListener("finish", finish_listener);
    if (!finished) finish_listener();
  })
  next();
}