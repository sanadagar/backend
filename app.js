const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://sanjanadagar301_db_user:sanjana123@chhipkali.dyxlyys.mongodb.net/?retryWrites=true&w=majority&appName=Chhipkali"
  )
  .then(() => console.log("connected to the authentication database!"))
  .catch((err) => console.log("Something went wrong with db connection!", err));

app.use("/user", authRouter);
app.use("/product", productRouter)

const {v2} = require("cloudinary");
const multer = require("multer");
const cloudinary = v2;

const uploader = multer({storage: multer.memoryStorage()});
cloudinary.config({
  cloud_name: "dtlm8rddj",
  api_key: "727516911875412",
  api_secret: "qLgVnpMZqffo3d0xPO4QG2hmNF8"
});

app.post("/uploadimage", uploader.array("images", 7), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Upload each image asynchronously
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

    const uploadedUrls = await Promise.all(uploadPromises);

    return res.status(200).json({
      message: "Images uploaded successfully",
      images: uploadedUrls
    });

  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return res.status(500).json({ error: "Failed to upload images" });
  }
});


app.listen(8080, () => console.log("localhost:8080"));