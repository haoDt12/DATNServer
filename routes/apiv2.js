const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/middleware");
const CusController = require("../controllersv2/controller.customer");
const CategoryController = require("../controllersv2/controller.category");
const ProductController = require("../controllersv2/controller.product");
const ProductCartCtrl = require("../controllersv2/controller.ProductCart");
const ApiCart = require("../controllersv2/controller.ProductCart");

router.post("/registerCustomer", CusController.registerCustomer);
router.post("/loginCustomer", CusController.loginCustomer);
router.post("/getInfoCus", CusController.getInfoCus);
router.post("/addFCM", CusController.addFCM);
router.post("/verifyCusLogin", CusController.verifyCusLogin);
router.get("/verifyCusRegister", CusController.verifyCusRegister);

router.post("/getCategory", CategoryController.getCategory);

router.post("/getAllProduct", ProductController.getAllProduct);
router.post("/getDetailProduct", ProductController.getDetailProduct);
// cart
router.post("/addCart", ProductCartCtrl.addCard);
router.post("/getCartByIdCustomer", ProductCartCtrl.getCartByIdCustomer);
router.post("/updateCart", ProductCartCtrl.updateCart);
router.post("/editCartV2", Middleware.authorizationToken, ProductCartCtrl.editCartV2);
module.exports = router;
