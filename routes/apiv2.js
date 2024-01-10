const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/middleware");
const CusController = require("../controllersv2/controller.customer");
const CategoryController = require("../controllersv2/controller.category");
const ProductController = require("../controllersv2/controller.product");
const ProductCartCtrl = require("../controllersv2/controller.ProductCart");
const DeliveryAddressCtrl = require("../controllersv2/controller.deliveryaddress");
const VoucherCtrl = require("../controllersv2/controller.voucher");
const OrderCtrl = require("../controllersv2/controller.order");
const FeedBackCtrl = require("../controllersv2/controller.feedback");
const AdminCtr = require("../controllersv2/controller.admin");
const EmployeeCtrl = require("../controllersv2/controller.employee");
const VnPayCtrl = require("../controllers/api.payvnpay");

//customer
router.post("/registerCustomer", CusController.registerCustomer);
router.post("/loginCustomer", CusController.loginCustomer);
router.post("/getInfoCus", Middleware.authorizationToken, CusController.getInfoCus);
router.post("/addFCM", Middleware.authorizationToken, CusController.addFCM);
router.post("/verifyCusLogin", CusController.verifyCusLogin);
router.get("/verifyCusRegister", CusController.verifyCusRegister);
router.get("/getInfoCus", Middleware.authorizationToken, CusController.getInfoCus);
router.post("/editCus", Middleware.authorizationToken, CusController.editCus);
router.post("/sendOtpEditCus", Middleware.authorizationToken, CusController.sendOtpEditCus);
router.post("/sendOtpEditPass", Middleware.authorizationToken, CusController.sendOtpEditPass);
router.post("/editPass", Middleware.authorizationToken, CusController.editPass);
router.post("/getPassWord", CusController.getPassWord);
router.get("/resetPassword",CusController.resetPassword);

//Admin
router.post("/loginAdmin", AdminCtr.loginAdmin);
router.post("/verifyOtpLoginAdmin", AdminCtr.verifyOtpLoginAdmin);

//Employee
router.post("/loginEmployee", EmployeeCtrl.loginEmployee);
router.post("/verifyOtpLoginEmployee", EmployeeCtrl.verifyOtpLoginEmployee);


//category
router.post("/getCategory", Middleware.authorizationToken, CategoryController.getCategory);

//product
router.post("/getAllProduct", Middleware.authorizationToken, ProductController.getAllProduct);
router.post("/getDetailProduct", Middleware.authorizationToken, ProductController.getDetailProduct);
router.post("/getProductRunOut", Middleware.authorizationToken, ProductController.getRunOutProducts);
router.post("/getProductRunOut", Middleware.authorizationToken, ProductController.getRunOutProducts);
router.post("/getProductByCategoryId", Middleware.authorizationToken, ProductController.getProductByCategoryId);
router.post("/searchProductByName", Middleware.authorizationToken, ProductController.searchProductByName);


// cart
router.post("/addCart", Middleware.authorizationToken, ProductCartCtrl.addCard);
router.post("/getCartByIdCustomer", Middleware.authorizationToken, ProductCartCtrl.getCartByIdCustomer);
router.post("/updateCart", Middleware.authorizationToken, ProductCartCtrl.updateCart);
router.post("/editCartV2", Middleware.authorizationToken, ProductCartCtrl.editCartV2
);

//DeliveryAddress
router.post("/addDeliveryAddress", Middleware.authorizationToken, DeliveryAddressCtrl.addDeliveryAddress);
router.post("/deleteDeliveryAddress", Middleware.authorizationToken, DeliveryAddressCtrl.deleteDeliveryAddress
);
router.post("/editDeliveryAddress", Middleware.authorizationToken, DeliveryAddressCtrl.editDeliveryAddress);
router.post("/getDeliveryAddress", Middleware.authorizationToken, DeliveryAddressCtrl.getDeliveryAddress);

//voucher
router.post("/addVoucherAllUser", Middleware.authorizationToken, VoucherCtrl.addVoucherAllUser);
router.post("/getVoucherByIdV2", Middleware.authorizationToken, VoucherCtrl.getVoucherByIdV2);

//order
router.post("/createOrder", Middleware.authorizationToken, OrderCtrl.createOrder);
router.post("/getOrderByStatus", Middleware.authorizationToken, OrderCtrl.getOrderByStatus);
router.post("/cancelOrder", Middleware.authorizationToken, OrderCtrl.cancelOrder);
router.post("/updateStatusOrder", Middleware.authorizationToken, OrderCtrl.updateStatusOrder);
router.post("/createOrderGuest", Middleware.authorizationToken, OrderCtrl.createOrderGuest);
router.post("/getStatic", Middleware.authorizationToken, OrderCtrl.getStatic);
router.post("/getPriceOrderZaloPay", Middleware.authorizationToken, OrderCtrl.getPriceOrderZaloPay);
router.post("/createOrderZaloPay", Middleware.authorizationToken, OrderCtrl.createOrderZaloPay);
router.post("/createPaymentUrl", Middleware.authorizationToken, VnPayCtrl.createPaymentUrl);

// feedback
router.post("/addFeedback", Middleware.authorizationToken, FeedBackCtrl.addFeedback);
router.post("/getFeedBackByProductId", Middleware.authorizationToken, FeedBackCtrl.getFeedBackByProductId);
router.post("/getAllFeedBackByProductId", Middleware.authorizationToken, FeedBackCtrl.getAllFeedBackByProductId);

module.exports = router;
