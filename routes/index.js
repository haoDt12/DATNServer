var express = require("express");
var router = express.Router();
const ProductModel = require("./../models/model.product");
const OrderModel = require("./../models/model.order");


const CategoryModel = require("./../models/model.category");
const UserModel = require("./../models/model.user");

/* GET home page. */
router.get("/stech.manager/home", function (req, res, next) {
  res.render("index");
});
router.get('/stech.manager/product', async function (req, res, next) {
    try {
        let listProduct = await ProductModel.productModel.find();
        res.render("product", {
            products: listProduct,
            message: "get list product success",
            code: 1
        });
    } catch (e) {
        console.log(e.message);
        res.send({ message: "product not found", code: 0 })
    }
});
router.get("/stech.manager/category", async function (req, res, next) {
  try {
      let listCategory = await CategoryModel.categoryModel.find();
      res.render("category", {
          category: listCategory,
          message: "get list category success",
          code: 1,
      });
  } catch (e) {
    console.log(e.message);
    res.send({ message: "category not found", code: 0 });
  }
});
router.get("/stech.manager/login", function (req, res, next) {
  res.render("login");
});
router.get("/stech.manager/register", function (req, res, next) {
  res.render("register");
});
router.get("/stech.manager/detail_product", async function (req, res, next) {
    try {
        var encodedProductId = req.query.productId;
        let productId = Buffer.from(encodedProductId, 'base64').toString('utf8');
        //let productId = req.query.productId;
        console.log("Received productId from cookie:", productId);

        let product = await ProductModel.productModel.findById(productId).populate({path: 'category', select:'title'});

        if (product) {
            res.render("detail_product", { detailProduct: product, message: "get product details success", code: 1 });
        } else {
            res.send({ message: "Product not found", code: 0 });
        }
    } catch (e) {
        console.error("Error fetching product details:", e.message);
        res.send({ message: "Error fetching product details", code: 0 });
    }
});

router.get('/stech.manager/user',  async function (req, res, next) {
    try {
        let listUser = await UserModel.userModel.find().populate({path: 'address', select:'city'});
        res.render("user", {
            users: listUser,
            message: "get list user success",
            code: 1,
        });
    } catch (e) {
        console.log(e.message);
        res.send({message: "user not found", code: 0});
    }
});
router.get("/stech.manager/verify", function (req, res, next) {
  res.render("verify");
});
router.get("/stech.manager/profile", function (req, res, next) {
  res.render("profile");
});
router.get("/stech.manager/chat", function (req, res, next) {
  res.render("chat");
});
router.get("/stech.manager/order", async function (req, res, next) {
  try {
      let orders = await OrderModel.modelOrder.find();
      console.log('Orders:', orders);
      const ordersWithProductInfo = await Promise.all(orders.map(async order => {
      const allProductInfo = await order.getAllProductInfo();
      const userInfo = await order.getUserInfo();
      console.log('ProductInfo:', allProductInfo);
      console.log('UserInfo:', userInfo);
      return { ...order.toObject(), allProductInfo, userInfo };
    }));
    res.render("order", { orders: ordersWithProductInfo, message: "get list order success", code: 1 });
} catch (e) {
    console.log(e.message);
    res.send({ message: "order not found", code: 0 })
}
});
router.get("/stech.manager/invoice", function (req, res, next) {
  res.render("invoice");
});
router.get("/stech.manager/cart", function (req, res, next) {
  res.render("cart");
});
router.get("/stech.manager/notification", function (req, res, next) {
  res.render("notification");
});
module.exports = router;
