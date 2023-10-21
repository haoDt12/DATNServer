const mongoose = require('./database');
const notificationSchema = mongoose.mongoose.Schema({
    userId: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {type: String, required: true},
    image: {type: String, required: true},
    time: {type: String, required: true},
    type: {type: String, required: true},
}, {
    collection: "Notification"
});
const modelNotification = mongoose.mongoose.model("notification", notificationSchema);
module.exports = {modelNotification}