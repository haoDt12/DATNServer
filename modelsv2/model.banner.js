const db = require('./database');
const bannerSchema = db.mongoose.Schema({
    img: {type: String, required: false}
}, {
    collection: "Banners"
});
const bannerModel = db.mongoose.model("banners", bannerSchema);
module.exports = {bannerModel}