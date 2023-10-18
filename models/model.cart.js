const database = require("./database");
const cartSchema = database.mongoose.Schema({
    userId: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    productId: [{
        type: database.mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: false
    }],
    total: {type: Number, required: true},
    date: {type: String, required: false},
}, {
    collection: "Cart"
});
const cartModel = database.mongoose.model("cart", cartSchema);
module.exports = {cartModel};