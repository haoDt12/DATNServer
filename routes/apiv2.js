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

//customer
router.post("/registerCustomer", CusController.registerCustomer);
router.post("/loginCustomer", CusController.loginCustomer);
router.post("/getInfoCus", CusController.getInfoCus);
router.post("/addFCM", CusController.addFCM);
router.post("/verifyCusLogin", CusController.verifyCusLogin);
router.get("/verifyCusRegister", CusController.verifyCusRegister);
router.get("/getInfoCus", CusController.getInfoCus);
router.post("/editCus", CusController.editCus);
router.post("/sendOtpEditCus", CusController.sendOtpEditCus);

//Admin
router.post("/loginAdmin", AdminCtr.loginAdmin);
router.post("/verifyOtpLoginAdmin", AdminCtr.verifyOtpLoginAdmin);

//Employee
router.post("/loginEmployee", EmployeeCtrl.loginEmployee);
router.post("/verifyOtpLoginEmployee", EmployeeCtrl.verifyOtpLoginEmployee);


//category
router.post("/getCategory", CategoryController.getCategory);

//product
router.post("/getAllProduct", ProductController.getAllProduct);
router.post("/getDetailProduct", ProductController.getDetailProduct);
router.post("/getProductRunOut", ProductController.getRunOutProducts);


// cart
router.post("/addCart", ProductCartCtrl.addCard);
router.post("/getCartByIdCustomer", ProductCartCtrl.getCartByIdCustomer);
router.post("/updateCart", ProductCartCtrl.updateCart);
router.post(
  "/editCartV2",
  Middleware.authorizationToken,
  ProductCartCtrl.editCartV2
);

//DeliveryAddress
router.post("/addDeliveryAddress", DeliveryAddressCtrl.addDeliveryAddress);
router.post(
  "/deleteDeliveryAddress",
  DeliveryAddressCtrl.deleteDeliveryAddress
);
router.post("/editDeliveryAddress", DeliveryAddressCtrl.editDeliveryAddress);
router.post("/getDeliveryAddress", DeliveryAddressCtrl.getDeliveryAddress);

//voucher
router.post("/addVoucherAllUser", VoucherCtrl.addVoucherAllUser);
router.post("/getVoucherByIdV2", VoucherCtrl.getVoucherByIdV2);

//order
router.post("/createOrder", OrderCtrl.createOrder);
router.post("/getOrderByStatus", OrderCtrl.getOrderByStatus);
router.post("/cancelOrder", OrderCtrl.cancelOrder);
router.post("/updateStatusOrder", OrderCtrl.updateStatusOrder);
router.post("/createOrderGuest", OrderCtrl.createOrderGuest);
router.post("/getStatic", OrderCtrl.getStatic);
// feedback
router.post("/addFeedback", FeedBackCtrl.addFeedback);
router.post("/getFeedBackByProductId", FeedBackCtrl.getFeedBackByProductId);
router.post(
  "/getAllFeedBackByProductId",
  FeedBackCtrl.getAllFeedBackByProductId
);

module.exports = router;
