const express = require('express');
const router = express.Router();
const MiddelwareUser = require("../middleware/middleware");
const ApiUserController = require("../controllers/api.user");
const multer = require("multer");
const upload = multer({dest: "uploads/"});
/* GET users listing. */
router.post('/api/registerUser', upload.single('file'), ApiUserController.addUser);
router.post('/api/editUser', upload.single('file'), ApiUserController.editUser);
module.exports = router;
