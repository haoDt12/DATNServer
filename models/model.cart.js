const database = require("./database");
const db = require("./database");
const cartSchema = database.mongoose.Schema(
  {
    userId: {
      type: database.mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: [
      {
        productId: {
            type: database.mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        title: { type: String, require: true },
        color: { type: String, required: true },
        ram_rom: { type: String, required: false },
        quantity: { type: Number, required: true },
        imgCover: { type: String, require: true },
        price: { type: String, require: true },
      },
    ],
    // total: { type: Number, required: true },
    date_time: { type: String, required: true },
  },
  {
    collection: "Cart",
  }
);

const cartModel = database.mongoose.model("cart", cartSchema);
module.exports = { cartModel };
