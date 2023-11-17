const db = require("./database");
const notificationPrivateSchema = db.mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    date: {type: db.mongoose.Schema.Types.ObjectId, required: true, ref: "user"},
}, {
    collection: "NotificationPrivate"
});
const notificationPrivateModel = db.mongoose.model("notificationPrivate", notificationPrivateSchema);
module.exports = {notificationPrivateModel}