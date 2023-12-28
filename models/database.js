const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect("mongodb://0.0.0.0:27017/Stech", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to DB."))
  .catch((err) => console.log(err));
module.exports = { mongoose };
