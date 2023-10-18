const database = require("./database");
const productSchema = database.mongoose.Schema({
    category: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    title: {type: String, required: true},
    description: {type: String, required: true},
    img_cover: {type: String, required: true},
    color: [{type: String,required:true}],
    price: {type: String, required: true},
    quantity: {type: String, required: true},
    sold: {type: String, required: true},
    list_img: [{type: String, required: true}],
    video: {type: String, required: true},
    date: {type: String, required: true},
    ram:[{type:String}],
    rom:[{type: String}]
}, {
    collection: "Product"
});
const productModel = database.mongoose.model("product", productSchema);
module.exports = {productModel};