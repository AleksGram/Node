const MessageModel = require("../models/message.model");
const { Filtering } = require("../utils/filterMessages") 



exports.get_messages_handler = async (req, res, next) => {
  const params = req.query;
  const dbData = await MessageModel.find({})
  res.send( filterData(dbData, params));
};

const filterData = (data, queryParams) => {
  let result = data;
  Object.keys(parseRequestParams).map(param => {
    if(queryParams[param]) {
      result = parseRequestParams[param](result, queryParams[param]);
    }
  })
  return result;
}


const parseRequestParams = {
  sort: (data, param) => Filtering.sortMessages(data, param),
  skip: (data, param) => Filtering.skipMessages(data, param),
  limit: (data, param) => Filtering.limitMessages(data, param)
}


exports.get_message_by_id = async (req, res, next) => {
  const { id } = req.params;  
  const dbData = await MessageModel.find({id})

  res.send(dbData || { code: 404, message: "not found" });
};

exports.add_new_message = async (req, res, next) => {
  const { messages } = res.app.locals;
let count = 0;

  const { text, sender } = req.body;

  const newMsg = {
    text,
    sender,
    id: messages.length + 1,
    addedAt: new Date().getTime()
  }

  MessageModel.create(newMsg, (error) => {
    if (error) {
      res.json({ error: true, messages: error.message })
      return;
    }
    res.json(messages[messages.length - 1]);
  });
};

exports.update_message_by_id = async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;

  console.log(text, id)

  const filter = {id};
  const update = {text, addedAt: new Date()}

  let doc = await MessageModel.findOneAndUpdate(filter, update, {
    returnOriginal: false
  });

  if (!doc) {
    return next({ code: 404, message: "not found" });
  }

  res.json(doc);
};

exports.delete_message_by_id = async (req, res, next) => {
  const { messages } = res.app.locals;
  const { id } = req.params;

  let doc = await MessageModel.findOneAndDelete({id});
  
  if (!doc) {
    return next({ code: 404, message: "not found" });
  }

  res.json(doc);
};
