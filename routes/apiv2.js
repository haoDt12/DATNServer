const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/middleware");
const CusController = require("../controllersv2/controller.customer");


router.post("/registerCustomer",CusController.registerCustomer);
router.post("/loginCustomer",CusController.loginCustomer);
router.post("/getInfoCus",CusController.getInfoCus);
router.post("/addFCM",CusController.addFCM);
router.post("/verifyCusLogin",CusController.verifyCusLogin);
router.get("/verifyCusRegister",CusController.verifyCusRegister);
module.exports = router;