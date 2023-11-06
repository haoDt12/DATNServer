var express = require("express");
var router = express.Router();
const ProductModel = require("./../models/model.product");

const CategoryModel = require("./../models/model.category");

/* GET home page. */
router.get("/stech.manager/home", function (req, res, next) {
  res.render("index");
});
router.get('/stech.manager/product', async function (req, res, next) {
    try {
        let listProduct = await ProductModel.productModel.find();
        res.render("product", { products: listProduct, message: "get list product success", code: 1 });
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
router.get("/stech.manager/add", function (req, res, next) {
  res.render("addAdmin");
});
router.get('/stech.manager/addProduct', function (req, res, next) {
    res.render('addProduct');
});
router.get('/stech.manager/user', function (req, res, next) {
    res.render('user');
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
router.get("/stech.manager/order", function (req, res, next) {
  res.render("order");
});
module.exports = router;
