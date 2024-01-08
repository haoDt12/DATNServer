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
    return res.send({
      message: "get product success",
      product: product,
      code: 1,
    });
  } catch (e) {
    console.log(e.message);
    return res.send({ message: e.message.toString(), code: 0 });
  }
};
exports.getDetailProduct = async (req, res) => {
  let data = [];
  let productId = req.body.productId;
  if (productId === null) {
    return res.send({ message: "product id is required", code: 0 });
  }
  try {
    let product = await ProductModel.productModel.findById(productId);
    let img = await ImgModel.productImgModel.find({ product_id: product._id });
    let video = await VideoModel.productVideoModel.find({
      product_id: product._id,
    });
    data.push({ product: product, img: img, video: video });
    return res.send({ message: "get detail success", data: data, code: 1 });
  } catch (e) {
    console.log(e.message);
    return res.send({ message: e.message.toString(), code: 0 });
  }
};

exports.getRunOutProducts = async (req, res) => {
  let products = await ProductModel.productModel.find();
  let productsRunOut = getProductsInRange(products)
  const ProductsRunOut = getTopProducts(10, productsRunOut);
  try {
    return res.send({ message: "get product is running out success", data: ProductsRunOut, code: 1 });
  }catch (e) {
    console.log(e.message);
    return res.send({ message: e.message.toString(), code: 0 });
  }
}

exports.getHotSellProducts = async (req, res) => {
  let products = await ProductModel.productModel.find();
  let productsRunOut = getProductsInRange(products)
  const ProductsRunOut = getTopProducts(10, productsRunOut);
  try {
    return res.send({ message: "get product is running out success", data: ProductsRunOut, code: 1 });
  }catch (e) {
    console.log(e.message);
    return res.send({ message: e.message.toString(), code: 0 });
  }
}
function getTopProducts(number, products) {
  const sortedProducts = sortProductsByQuantity(products);
  return sortedProducts.slice(0, number);
}
function getTopSaleProducts(number, products) {
  const sortedProducts = sortProductsBySold(products);
  return sortedProducts.slice(0, number);
}
function sortProductsByQuantity(products) {
  return products.sort((a, b) => a.quantity - b.quantity);
}
function sortProductsBySold(products) {
  return products.sort((a, b) => b.sold - a.sold);
}
function getProductsInRange(products) {
  let limit = Math.min(products.quantity);
  return products.filter(product => product.quantity >= 1 && product.quantity <= limit);
}
