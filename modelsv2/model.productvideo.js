const db = require("../models/database");
const productVideoSchema = db.mongoose.Schema({
    name: {type: String, required: true},
    product_id: {type: String, required: true},
    img: {type: String, required: true},
},{
    collection:"Product_video"
});
const productVideoModel = db.mongoose.model("product_video",productVideoSchema);
module.exports = {productVideoModel};