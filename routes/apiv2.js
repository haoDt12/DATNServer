const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/middleware");
const CusController = require("../controllersv2/controller.customer");
const ApiBanner = require("../controllersv2/controller.banner");
router.post("/registerCustomer",CusController.registerCustomer);
router.post("/loginCustomer",CusController.loginCustomer);
router.post("/getInfoCus",CusController.getInfoCus);
router.post("/addFCM",CusController.addFCM);
router.post("/verifyCusLogin",CusController.verifyCusLogin);
router.get("/verifyCusRegister",CusController.verifyCusRegister);
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
router.post(
    "/getBannerById",
    Middleware.authorizationToken,
    upload.single("file"),
    ApiBanner.getBannerById
);
module.exports = router;