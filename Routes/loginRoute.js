const express = require("express");

const router = express.Router();

const adminController = require("../Controllers/adminController");

router.post("/signup", adminController.signup);

router.post("/", adminController.login);

module.exports = router;
