const database = require("../models/database");
const cartSchema = database.mongoose.Schema(
    {
        _id: {
            type: db.mongoose.Schema.Types.ObjectId,
            ref: "customer",
            required: false,
        },
        productId: {
            type: database.mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        quantity:{type: String, required: true},
        date_time: {type: String, required: true},
    },
    {
        collection: "Product_carts",
    }
);

const productCartModel = database.mongoose.model("product_carts", cartSchema);
module.exports = {productCartModel};
