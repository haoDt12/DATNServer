var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/stech.manager/home', function (req, res, next) {
    res.render('index', {title: 'Danh Sách Sản Phẩm'});
});

module.exports = router;
