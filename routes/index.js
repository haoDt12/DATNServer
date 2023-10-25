var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/stech.manager/home', function (req, res, next) {
    res.render('index');
});
router.get('/stech.manager/product', function (req, res, next) {
    res.render('product');
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
router.get('/stech.manager/user', function (req, res, next) {
    res.render('user');
});
router.get('/stech.manager/verify', function (req, res, next) {
    res.render('verify');
});
module.exports = router;
