const database = require("./database");
const messageSchema = database.mongoose.Schema(
  {
    conversation: {
      type: database.mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true
    },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true }, // seen, unseen, hidden, received, sent,
    deleted: { type: Boolean, required: true },
    timestamp: { type: String, required: true },
  },
  {
    collection: "Message",
  }
);
const messageModel = database.mongoose.model("message", messageSchema);
module.exports = { messageModel };
