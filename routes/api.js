const express = require('express');
const router = express.Router();
const Middleware = require("../middleware/middleware");
const ApiUserController = require("../controllers/api.user");
const ApiCategory = require("../controllers/api.category");
const ApiCart = require("../controllers/api.cart");
const ApiProduct = require("../controllers/api.product");
const ApiAddress = require("../controllers/api.address");
const ApiOrder = require("../controllers/api.order");
const multer = require("multer");
const upload = multer({dest: "uploads/"});
/* GET api listing. */
router.post('/registerUser',upload.single('file'), ApiUserController.addUser);
router.post('/editUser',Middleware.authorizationToken, upload.single('file'), ApiUserController.editUser);
router.post('/loginUser',Middleware.validateUser, ApiUserController.loginUser);
router.post('/getListUser',Middleware.authorizationToken,ApiUserController.getListUser);

router.post('/addCategory',Middleware.authorizationToken, upload.single('file'), ApiCategory.addCategory);
router.post('/editCategory',Middleware.authorizationToken, upload.single('file'), ApiCategory.editCategory);
router.post('/deleteCategory',Middleware.authorizationToken, ApiCategory.deleteCategory);
router.post('/getListCategory',Middleware.authorizationToken, ApiCategory.getListCategory);

router.post('/addProduct',Middleware.authorizationToken, upload.fields([{name:"img_cover",maxCount: 1},{name:"list_img",maxCount: 10},{name:"video",maxCount: 1}]), ApiProduct.addProduct);
router.post('/getListProduct',Middleware.authorizationToken, ApiProduct.getListProduct);
router.post('/getProductById',Middleware.authorizationToken, ApiProduct.getProductById);
router.post('/deleteProduct',Middleware.authorizationToken, ApiProduct.deleteProduct);
router.post('/editProduct',Middleware.authorizationToken, upload.fields([{name:"img_cover",maxCount: 1},{name:"list_img",maxCount: 10},{name:"video",maxCount: 1}]),ApiProduct.editProduct);

router.post('/addAddress',Middleware.authorizationToken,ApiAddress.addAddress);
router.post('/editAddress',Middleware.authorizationToken,ApiAddress.editAddress);
router.post('/deleteAddress',Middleware.authorizationToken,ApiAddress.deleteAddress);

router.post('/createOrder',Middleware.authorizationToken,ApiOrder.creatOrder);
router.post('/getOrderByUserId',Middleware.authorizationToken,ApiOrder.getOrderByUserId);
router.post('/getOrderByOrderId',Middleware.authorizationToken,ApiOrder.getOrderByOrderId);
router.post('/getOrder',Middleware.authorizationToken,ApiOrder.getOrder);
router.post('/deleteOrder',Middleware.authorizationToken,ApiOrder.deleteOrder);
router.post('/editOrder',Middleware.authorizationToken,ApiOrder.editOrder);

router.post('/addCart',Middleware.authorizationToken,ApiCart.addCart);
router.post('/getCartByUserId',Middleware.authorizationToken,ApiCart.getCartByUserId);
router.post('/getCart',Middleware.authorizationToken,ApiCart.getCart);
router.post('/deleteCart',Middleware.authorizationToken,ApiCart.deleteCart);
router.post('/editCart',Middleware.authorizationToken,ApiCart.editCart);
router.post('/getCartByCartId',Middleware.authorizationToken,ApiCart.getCartByCartId);

module.exports = router;
