const MessageModel = require("../models/message.model");
const { convertTime } = require("../utils/timeConverter");


const prepareData = async () => {
    const dbData = await MessageModel.find({})
    return dbData.map(({ id, text, sender, addedAt }) => {
        return { id, text, sender, addedAt: convertTime(addedAt) }
    });
}

exports.get_nunjucks_tmpl = async (req, res, next) => {
    const messages = await prepareData();
    res.render("index.nunjucks", { messages });
}

exports.get_ejs_tmpl = async (req, res, next) => {
    res.render("index.ejs", { messages: await prepareData() });
}

exports.get_pug_tmpl = async (req, res, next) => {
    res.render("index.pug", { messages: await prepareData() });
}