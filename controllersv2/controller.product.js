const ImgModel = require("../modelsv2/model.imgproduct");
const VideoModel = require("../modelsv2/model.productvideo");
const ProductModel = require("../modelsv2/model.product");
exports.getAllProduct = async (req, res) => {

    try {
        let product = await ProductModel.productModel.find();
        // await Promise.all(product.map(async item => {
        //     let img = await ImgModel.productImgModel.find({product_id: item._id});
        //     let video = await VideoModel.productVideoModel.find({product_id: item._id});
        //     itemProduct.product = item;
        //     itemProduct.img = img;
        //     itemProduct.video = video;
        //     data.push(itemProduct);
        // }));
        return res.send({message: "get product success", product: product, code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
exports.getDetailProduct = async (req, res) => {
    let data = [];
    let productId = req.body.productId;
    if (productId === null) {
        return res.send({message: "product id is required", code: 0});
    }
    try {
        let product = await ProductModel.productModel.findById(productId);
        let img = await ImgModel.productImgModel.find({product_id: product._id});
        let video = await VideoModel.productVideoModel.find({product_id: product._id});
        data.push({product:product, img:img, video:video});
        return res.send({message: "get detail success", data: data, code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: e.message.toString(), code: 0});
    }
}
