const database = require("./database");
const cartSchema = database.mongoose.Schema({
    userId: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    product: [{
        type: database.mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: false
    }],
    title: {type: String, required: false},
    img: {type: String, required: true},
    quantity: {type: Number, required: true},
    total: {type: Number, required: true},
    price: [{type: Number, required: true}],
    date: {type: String, required: false},
}, {
    collection: "Cart"
});
const cartModel = database.mongoose.model("cart", cartSchema);
module.exports = {cartModel};