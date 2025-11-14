const express=require("express");
const productRouter=express.Router();

const{createaHandler, findallHandler}=require("./../controllers/productcontroller");
const multer = require("multer");
const { protect, restrictToAdmin } = require("../controllers/authController");

const uploadImages = multer({storage: multer.memoryStorage()});
productRouter.get("/", findallHandler);
productRouter.use(protect);
productRouter.use(restrictToAdmin);

productRouter.post("/create",uploadImages.array("images", 10),createaHandler);

module.exports=productRouter;