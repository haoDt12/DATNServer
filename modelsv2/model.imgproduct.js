const db = require("../models/database");
const productImgSchema = db.mongoose.Schema({
    name: {type: String, required: true},
    product_id: {type: String, required: true},
    img: {type: String, required: true},
},{
    collection:"Product_image"
});
const productImgModel = db.mongoose.model("product_image",productImgSchema);
module.exports = {productImgModel};