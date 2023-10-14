const db = require("./database");
const orderSchema = db.mongoose.Schema({
    userId: {type: db.mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    product: [{type: db.mongoose.Schema.Types.ObjectId, ref: 'product', required: true}],
    price: {type: Number, required: true},
    address: {type: db.mongoose.Schema.Types.ObjectId, ref: 'address', required: true},
    total: {type: Number, required: true},
    quantity: {type: Number, required: true},
    status: {type: String, required: false},
    date_time: {type: String, required: false},
}, {
    collection: "Order"
});
const modelOrder = db.mongoose.model("order", orderSchema);
module.exports = {modelOrder};