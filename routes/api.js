const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/middleware");
const ApiUserController = require("../controllers/api.user");
const ApiCategory = require("../controllers/api.category");
const ApiCart = require("../controllers/api.cart");
const ApiProduct = require("../controllers/api.product");
const ApiAddress = require("../controllers/api.address");
const ApiOrder = require("../controllers/api.order");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const ApiBanner = require("../controllers/api.banner");
const ApiVoucher = require("../controllers/api.voucher");
const ApiAdmin = require("../controllers/api.admin");

const ApiFeedBack = require("../controllers/api.feedback");
const  ApiNotification = require("../controllers/api.notification");
const ApiConversation = require("../controllers/api.conversation")
const ApiMessage = require("../controllers/api.message")
const ApiVNP = require("../controllers/api.payvnpay");
/* GET api listing. */
router.post("/registerUser", upload.single("file"), ApiUserController.addUser);
router.post(
  "/editUser",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiUserController.editUser
);
router.post("/loginUser", ApiUserController.loginUser);
router.post(
  "/getUserById",
  Middleware.authorizationToken,
  ApiUserController.getUserById
);
router.post(
  "/getListUser",
  Middleware.authorizationToken,
  ApiUserController.getListUser
);
router.post("/verifyOtpRegister", ApiUserController.verifyOtpRegister);
router.post("/verifyOtpLogin", ApiUserController.verifyOtpLogin);
router.post("/editPassword", Middleware.authorizationToken, ApiUserController.editPassword);
router.post("/verifyOtpEditPass", Middleware.authorizationToken, ApiUserController.verifyOtpEditPass);
router.post("/getPassWord", Middleware.authorizationToken, ApiUserController.getPassWord);
router.get("/resetPassword", ApiUserController.resetPassword);
router.post("/updateconversationID", ApiConversation.updateconversationID);

router.post(
  "/addCategory",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiCategory.addCategory
);
router.post(
  "/editCategory",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiCategory.editCategory
);
router.post(
  "/getCategoryById",
  Middleware.authorizationToken,
  ApiCategory.getCategoryById
);
router.post(
  "/deleteCategory",
  Middleware.authorizationToken,
  ApiCategory.deleteCategory
);
router.post(
  "/getListCategory",
  Middleware.authorizationToken,
  ApiCategory.getListCategory
);

router.post(
  "/addProduct",
  // Middleware.authorizationToken,
  upload.fields([
    { name: "img_cover", maxCount: 1 },
    { name: "list_img", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  ApiProduct.addProduct
);
router.post(
  "/getListProduct",
  Middleware.authorizationToken,
  ApiProduct.getListProduct
);
router.post(
  "/getProductById",
  Middleware.authorizationToken,
  ApiProduct.getProductById
);
router.post(
  "/getProductByIdCate",
  Middleware.authorizationToken,
  ApiProduct.getProductByIdCate
);
router.post(
  "/deleteProduct",
  Middleware.authorizationToken,
  ApiProduct.deleteProduct
);
router.post(
  "/editProduct",
  Middleware.authorizationToken,
  upload.fields([
    { name: "img_cover", maxCount: 1 },
    { name: "list_img", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  ApiProduct.editProduct
);

router.post(
  "/addAddress",
  Middleware.authorizationToken,
  ApiAddress.addAddress
);
router.post(
  "/editAddress",
  Middleware.authorizationToken,
  ApiAddress.editAddress
);
router.post(
  "/deleteAddress",
  Middleware.authorizationToken,
  ApiAddress.deleteAddress
);

router.post("/createOrder", Middleware.authorizationToken, ApiOrder.creatOrder);
router.post(
  "/getOrderByUserId",
  Middleware.authorizationToken,
  ApiOrder.getOrderByUserId
);
router.post(
  "/getOrderByOrderId",
  Middleware.authorizationToken,
  ApiOrder.getOrderByOrderId
);
router.post("/getOrder", Middleware.authorizationToken, ApiOrder.getOrder);
router.post(
  "/deleteOrder",
  Middleware.authorizationToken,
  ApiOrder.deleteOrder
);
router.post("/editOrder", Middleware.authorizationToken, ApiOrder.editOrder);

router.post("/addCart", Middleware.authorizationToken, ApiCart.addCart);
router.post(
  "/getCartByUserId",
  Middleware.authorizationToken,
  ApiCart.getCartByUserId
);
router.post("/getCart", Middleware.authorizationToken, ApiCart.getCart);
router.post("/deleteCart", Middleware.authorizationToken, ApiCart.deleteCart);
router.post("/editCart", Middleware.authorizationToken, ApiCart.editCart);
router.post("/editCartV2", Middleware.authorizationToken, ApiCart.editCartV2);
router.post(
  "/getCartByCartId",
  Middleware.authorizationToken,
  ApiCart.getCartByCartId
);
router.post(
  "/getCartByCartIdUser",
  Middleware.authorizationToken,
  ApiCart.getCartByUserId
);
router.post(
  "/addBanner",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiBanner.addBanner
);
router.post(
  "/editBanner",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiBanner.editBanner
);
router.post(
  "/deleteBanner",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiBanner.deleteBanner
);
router.post(
  "/getListBanner",
  Middleware.authorizationToken,
  upload.single("file"),
  ApiBanner.getLisBanner
);

router.post("/addFCM", Middleware.authorizationToken, ApiUserController.addFCM);
router.post(
  "/addNotificationPublic",
  Middleware.authorizationToken,
  ApiNotification.addNotificationPublic
);
router.post(
  "/addNotificationPublic",
  Middleware.authorizationToken,
  ApiNotification.addNotificationPrivate
);
router.post(
  "/editNotification",
  Middleware.authorizationToken,
  ApiNotification.editNotification
);
router.post(
  "/deleteNotification",
  Middleware.authorizationToken,
  ApiNotification.deleteNotification
);
router.post(
  "/getPrivateNotification",
  Middleware.authorizationToken,
  ApiNotification.getPrivateNotification
);
router.post(
  "/getPublicNotification",
  Middleware.authorizationToken,
  ApiNotification.getPublicNotification
);
router.post(
  "/addFeedBack",
  Middleware.authorizationToken,
  ApiFeedBack.addFeedBack
);
router.post(
  "/getFeedBackByProductId",
  Middleware.authorizationToken,
  ApiFeedBack.getFeedBackByProductId
);
router.post(
  "/getAllFeedBackByProductId",
  Middleware.authorizationToken,
  ApiFeedBack.getAllFeedBackByProductId
);

router.post("/addFCM",Middleware.authorizationToken,ApiUserController.addFCM);
router.post("/addNotificationPublic",Middleware.authorizationToken,ApiNotification.addNotificationPublic);
router.post("/addNotificationPrivate",Middleware.authorizationToken,ApiNotification.addNotificationPrivate);
router.post("/editNotification",Middleware.authorizationToken,ApiNotification.editNotification);
router.post("/deleteNotification",Middleware.authorizationToken,ApiNotification.deleteNotification);
router.post("/getPrivateNotification",Middleware.authorizationToken,ApiNotification.getPrivateNotification);
router.post("/getPublicNotification",Middleware.authorizationToken,ApiNotification.getPublicNotification);

// API Conversation
router.post("/createConversation",Middleware.authorizationToken,ApiConversation.createConversation);
router.post("/deleteConversation",Middleware.authorizationToken,ApiConversation.deleteConversation);
router.post("/editConversation",Middleware.authorizationToken,ApiConversation.editConversation);
router.post("/getConversationByID",Middleware.authorizationToken,ApiConversation.getConversationByID);
router.post("/getConversation",Middleware.authorizationToken,ApiConversation.getConversation);

// API MESSAGE
router.post("/addMessage",Middleware.authorizationToken,ApiMessage.addMessage);


router.post("/createPaymentUrl",ApiVNP.createPaymentUrl);
router.get("/payFail",ApiVNP.payFail);
router.get("/paySuccess",ApiVNP.paySuccess);
router.get("/vnpayReturn",ApiVNP.vnpayReturn);

router.post("/addVoucherForOneUser", Middleware.authorizationToken, ApiVoucher.addVoucherForOneUser);
router.post("/addVoucherForAllUser", Middleware.authorizationToken, ApiVoucher.addVoucherForAllUser);
router.post("/getVoucherByUserId", Middleware.authorizationToken, ApiVoucher.getVoucherByUserId);
router.post("/deleteVoucher", Middleware.authorizationToken, ApiVoucher.deleteVoucher);
router.post("/editVoucher", Middleware.authorizationToken, ApiVoucher.editVoucher);
router.post("/getAllVoucher", Middleware.authorizationToken, ApiVoucher.getAllVoucher);

router.post("/addAdmin", ApiAdmin.addAdmin);
router.post("/loginAdmin", ApiAdmin.loginAdmin);
router.post("/verifyOtpLoginAdmin", ApiAdmin.verifyOtpLogin);
router.post("/editAdmin", Middleware.authorizationToken, upload.single("file"), ApiAdmin.editAdmin);
router.post("/deleteAdmin", Middleware.authorizationToken, ApiAdmin.editAdmin);
module.exports = router;
