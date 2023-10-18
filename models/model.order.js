const db = require("./database");
const orderSchema = db.mongoose.Schema({
    userId: {type: db.mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    productId: [{type: db.mongoose.Schema.Types.ObjectId, ref: 'product', required: true}],
    addressId: {type: db.mongoose.Schema.Types.ObjectId, ref: 'address', required: true},
    total: {type: Number, required: true},
    status: {type: String, required: true},
    date_time: {type: String, required: true},
}, {
    collection: "Order"
});
const modelOrder = db.mongoose.model("order", orderSchema);
module.exports = {modelOrder};