const { testData } = require("../testData");
const MessageModel = require("../models/message.model");
const { convertTime } = require("../utils/timeConverter");


const prepareData = async (res) => {
    // const messages = res.app.locals.messages.length ? res.app.locals.messages : testData;

    // return messages.map(element => {
    //     return { ...element, addedAt: convertTime(element.addedAt) }
    // });
    const dbData = await MessageModel.find({})
    return dbData.map(element => {
            return { ...element, addedAt: convertTime(element.addedAt) }
        });
}

exports.get_nunjucks_tmpl = (req, res, next) => {
    console.log(prepareData(res))
    res.render("index.nunjucks", { messages: prepareData() });
}

exports.get_ejs_tmpl = (req, res, next) => {
    res.render("index.ejs", { messages: prepareData(res) });
}

exports.get_pug_tmpl = (req, res, next) => {
    res.render("index.pug", { messages: prepareData(res) });
}