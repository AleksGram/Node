const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);

const messageShema = new mongoose.Schema(
    {
        addedAt: Date,
        id: {
         type: Number,
         index: true,
         unique: true,
        },
        text: String,
        sender: String,     
    },
    {
        collation: "messages"
    }
);

module.exports = mongoose.model("Messages", messageShema)