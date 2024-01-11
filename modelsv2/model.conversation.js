const db = require("../models/database");
const conversationSchema = db.mongoose.Schema(
    {
        creator_id: { type: String, required: true },
        receive_id: { type: String, required: true },
        created_at: { type: String, required: true },
        updated_at: { type: String, required: true },
        deleted_at: { type: String, required: true }
    },
    {
        collection: "Conversations",
    }
);
const conversationModel = db.mongoose.model("conversations", conversationSchema);
module.exports = { conversationModel };
