const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);

const messageShema = new mongoose.Schema(
    {
        addedAt: Date,
        id: {
         type: String,
         index: true,
         unique: true,
        },
        text: String,
        autor: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
        deletedAt: { type: Date },
        createdBy: {type: String}, 
    },
    {
        collection: "messages"
    }
);

module.exports = mongoose.model("Messages", messageShema)