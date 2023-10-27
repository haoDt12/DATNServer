var express = require('express');
var router = express.Router();
const ProductModel = require("./../models/model.product");

/* GET home page. */
router.get('/stech.manager/home', function (req, res, next) {
    res.render('index');
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
router.get('/stech.manager/category', function (req, res, next) {
    res.render('category');
});
router.get('/stech.manager/login', function (req, res, next) {
    res.render('login');
});
router.get('/stech.manager/add', function (req, res, next) {
    res.render('addAdmin');
});
router.get('/stech.manager/addProduct', function (req, res, next) {
    res.render('addProduct');
});
router.get('/stech.manager/user', function (req, res, next) {
    res.render('user');
});
module.exports = router;
