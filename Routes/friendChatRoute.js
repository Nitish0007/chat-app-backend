const express = require("express");
const friendController = require("../Controllers/friendController");

const router = express.Router();

router.post("/add_friend", friendController.addfriend);

module.exports = router;
