const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.URL_DB).catch((err) => {
    console.log(err);
});
module.exports = {mongoose};