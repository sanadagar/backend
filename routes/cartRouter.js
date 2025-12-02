const express = require("express");
const { addItemToCart } = require("./../controllers/cartController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.use(protect)
router.post("/", addItemToCart);

module.exports = router;