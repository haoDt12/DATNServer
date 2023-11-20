const db = require("./database");
const status = "WaitConfirm";
const orderSchema = db.mongoose.Schema({
    userId: {type: db.mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    product: [{
        productId: {type: db.mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
        color: {type: String, required: true},
        ram_rom: {type: String, required: false},
        quantity: {type: Number, required: true}
    }],
    addressId: {type: db.mongoose.Schema.Types.ObjectId, ref: 'address', required: true},
    total: {type: Number, required: true},
    status: {type: String, default: status},
    date_time: {type: String, required: true},
}, {
    collection: "Order"
});
const modelOrder = db.mongoose.model("order", orderSchema);
module.exports = {modelOrder};