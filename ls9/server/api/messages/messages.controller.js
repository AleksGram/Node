const MessageModel = require("../models/message.model");
const { Filtering } = require("../utils/filterMessages");
const uniqid = require('uniqid');

const hasAdminPermissions = user => user.role === "admin";


exports.get_messages_handler = async (req, res, next) => {
  const { user } = req.session;
  const params = req.query;
  const dbData = await MessageModel.find({ deletedAt: undefined })
  res.send(filterData(dbData, params));
};

const filterData = (data, queryParams) => {
  let result = data;
  Object.keys(parseRequestParams).map(param => {
    if (queryParams[param]) {
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
  const dbData = await MessageModel.find({ id })

  res.send(dbData || { code: 404, error: "not found" });
};

exports.add_new_message = async (req, res, next) => {
  const { text, autor } = req.body;
  const { user } = req.session;

  if (!user) {
    res.json({ error: "Please login or register" })
    return
  }

  const newMsg = {
    text,
    autor,
    createdBy: user._id,
    id: uniqid(),
    addedAt: new Date().getTime()
  }
  debugger

  MessageModel.create(newMsg, (error) => {
    if (error) {
      res.json({ error: error.message })
      return;
    }
    res.json({ id: newMsg.id, addedAt: newMsg.addedAt });
  });
};

exports.update_message_by_id = async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const { user } = req.session;

  const dbData = await MessageModel.find({ id })
  if (!dbData.length || !isPermited(user._id, dbData[0])) return next({ error: "Not permited" })

  const filter = { id };
  const update = { text, addedAt: new Date() }
  let doc = await MessageModel.findOneAndUpdate(filter, update, {
    returnOriginal: false
  });
  if (!doc) {
    return next({ code: 404, message: "not found" });
  }

  res.json(doc);
};

const isPermited = (userId, doc) => {
  const { createdBy, updatedAt, addedAt } = doc;
  const currentTime = new Date().getTime();

  const timeDiff = updatedAt
    ? (currentTime - updatedAt) / 60000
    : (currentTime - addedAt) / 60000

  if (userId !== createdBy || timeDiff > 5) {
    return false
  }
  return true
}

exports.delete_message_by_id = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req.session;
  const dbData = await MessageModel.find({ id })

  if (!hasAdminPermissions(user)) {
    if (!dbData.length || !isPermited(user._id, dbData[0])) return next({ error: "Not permited" })
  }

  const filter = { id };
  const update = { deletedAt: new Date() }
  let doc = await MessageModel.findOneAndUpdate(filter, update, {
    returnOriginal: false
  });

  if (!doc) {
    return next({ code: 404, message: "not found" });
  }


  // let doc = await MessageModel.findOneAndDelete({id});
  // if (!doc) {
  //   return next({ code: 404, error: "Not found" });
  // }

  res.json(doc);
};
