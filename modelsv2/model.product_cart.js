const database = require("../models/database");
const cartSchema = database.mongoose.Schema(
    {
        userId: {
            type: database.mongoose.Schema.Types.ObjectId,
            ref: "user",
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
