const mongoose = require('./database');
const commentSchema = mongoose.mongoose.Schema({
    userId: {type: mongoose.mongoose.Schema.Types.ObjectId, ref:'user',required: true},
    productId: {type: mongoose.mongoose.Schema.Types.ObjectId,ref:'product', required: true},
    rating: {type: Number, required: false},
    comment: {type: String, required: true},
    date: {type: String, required: true},
}, {
    collection: "Comment"
});
const modelComment = mongoose.mongoose.model("comment", commentSchema);
module.exports = {modelComment}