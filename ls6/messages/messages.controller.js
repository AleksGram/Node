const testData = [
  {
  "text": "Comon",
  "sender": "Jack",
  "id": 1,
  "addedAt": 1586354019602
  },
  {
  "text": "By",
  "sender": "Dan",
  "id": 2,
  "addedAt": 1586354031859
  },
  {
  "text": "Fu",
  "sender": "Ira",
  "id": 3,
  "addedAt": 1586354040796
  },
  {
  "text": "Kalaka",
  "sender": "Boris",
  "id": 4,
  "addedAt": 1586354054796
  },
  {
  "text": "Buper",
  "sender": "Ken",
  "id": 5,
  "addedAt": 1586354065796
  },
  {
  "text": "Super",
  "sender": "Susana",
  "id": 6,
  "addedAt": 1586354044796
  }
  ];
const { Filtering } = require("../utils/filterMessages") 
exports.get_messages_handler = (req, res, next) => {
  const params = req.query;
  const messages = res.app.locals.messages.length ? res.app.locals.messages : testData;

  res.send( filterData(messages, params));
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


exports.get_message_by_id = (req, res, next) => {
  const { messages } = res.app.locals;
  const { id } = req.params;
  const result = messages.find(message => message.id === id);
  res.send(result || { code: 404, message: "not found" });
};

exports.add_new_message = (req, res, next) => {
  const { messages } = res.app.locals;
  const { text, sender } = req.body;

  messages.push({ text, sender, id: messages.length + 1, addedAt: new Date().getTime() });
  res.json(messages[messages.length - 1]);
};

exports.update_message_by_id = (req, res, next) => {
  const { messages } = res.app.locals;
  const { text } = req.body;
  const { id } = req.params;

  const message = messages.find(message => message.id === id);
  if (!message) {
    return next({ code: 404, message: "not found" });
  }
  Object.assign(message, { text, updatedAt: new Date() });

  res.json(message);
};

exports.delete_message_by_id = (req, res, next) => {
  const { messages } = res.app.locals;
  const { id } = req.params;

  const message_id = messages.findIndex(message => message.id === id);
  if (message_id < 0) {
    return next({ code: 404, message: "not found" });
  }
  const message = messages[message_id];
  messages.splice(message_id, 1);

  res.json(message);
};
