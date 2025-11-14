const Product = require("./../modals/productmodel");
const { fileTypeFromBuffer } = require("file-type");
const fs = require("fs/promises");
const crypto = require("crypto");
const path = require("path");
// 4-5 images

const saveImages = async(images, imageNames)=>{
  const allowedExt = ["jpg", "jpeg", "webp", "png"];

  await Promise.all(images.map(async (image) => {
    const { ext } = await fileTypeFromBuffer(image.buffer);
    if (allowedExt.includes(ext)) {
      const fileName = `${Math.floor(Math.random() * 10000000)}-${crypto
        .randomBytes(8)
        .toString("hex")}.${ext}`;
     await fs.writeFile("./uploads/" + fileName, image.buffer);

     imageNames.push(fileName);
    }
  }));


}

const cloudinary = require("../config/cloudinary");
exports.createaHandler = async (req, res) => {
  try {
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "productImages" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        ).end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);

    console.log("Reached products create handler");
    let { title, description, price, sizes } = req.body;
    if (!title|| !description || !price || !sizes)
      throw new Error("Missing required fields!");

    const createdProduct = await Product.create({
      title,
      images,
      description,
      price,
      sizes,
    });
    res.status(201).json({ Message: createdProduct });
  } catch (error) {
    if (error.name == "ValidationError") {
      const allErrors = error.errors;
      const errors = Object.keys(allErrors).map(function (key) {
        return allErrors[key].message;
      });
      return res.status(400).json({ error: errors });
    }
    if (error.code == 11000) {
      const fieldName = Object.keys(error.keyValue)[0];
      return res
        .status(400)
        .json({ error: `The ${fieldName} has already been taken!` });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.findallHandler = async (req, res) => {
   try {
    const allProducts = await Product.find().select("title images price").lean();
    allProducts.forEach(prod=>{
      prod.image = prod.images[0];
      prod.images = undefined;
    });
      
    res.status(200).json({products: allProducts});
   } catch (error) {
    res.status(400).json({ message: error.message });
   }
};
