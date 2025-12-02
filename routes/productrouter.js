const express=require("express");
const productRouter=express.Router();

const{createaHandler, findallHandler}=require("./../controllers/productcontroller");
const multer = require("multer");
const { protect, restrictToAdmin } = require("../controllers/authController");
const Product = require("../modals/productmodel");

const uploadImages = multer({storage: multer.memoryStorage()});
productRouter.get("/", findallHandler);
productRouter.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
productRouter.use(protect);
productRouter.use(restrictToAdmin);

productRouter.post("/create",uploadImages.array("images", 10),createaHandler);

module.exports=productRouter;