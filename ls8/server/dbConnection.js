const mongoose = require("mongoose");

exports.connectToDb = () => {
    mongoose.connect("mongodb://localhost:27017/contactbook", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      
    mongoose.set("debug", true);
    mongoose.connection.on("error", (e) => {
        console.error("MongoDB connection errro", e);
        process.exit(1);
    });

}