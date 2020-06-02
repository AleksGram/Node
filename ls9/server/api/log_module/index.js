const { createReadStream, createWriteStream } = require("fs");
const { Logger } = require("../utils/logger");

exports.log_module = (req, res, next) => {
  const logRequest = createWriteStream("./Logs/requestLog.txt", { flags: "a" });

  const start_time = new Date().getTime();
  let finished = false;

  const finish_listener = () => {
    finished = true;
    const endTime = new Date().getTime();
    const timeSpent = endTime - start_time;
    Logger.logRequest({ req, res }, logRequest, timeSpent)
    next()
  };

  
  res.once("finish", finish_listener)
  res.once("close", () => {
    res.removeListener("finish", finish_listener);
    if (!finished) finish_listener();
  })
  next();
}