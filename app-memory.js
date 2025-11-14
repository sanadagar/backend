const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");

const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

const upload = multer({
  storage: multer.memoryStorage(),
});

const { fileTypeFromBuffer } = require("file-type");
const { writeFile } = require("fs/promises");

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = await fileTypeFromBuffer(req.file.buffer); // {ext:"png", mime: "image/png"}
    const allowedExt = ["png", "jpeg", "jpg", "webp"];
    const validFileType = allowedExt.includes(file.ext);

    if (!validFileType)
      throw new Error("Only png, jpeg, jpg and webp images are allowed!");

    const fileName = `${Math.floor(Math.random() * 1000000)}-${crypto
      .randomBytes(4)
      .toString("hex")}-${path.extname(req.file.originalname)}`;

    await writeFile("./uploads/" + fileName, req.file.buffer);
    res.status(201).json({message: "File uploaded successfully!"});

    console.log(req.body);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use("/user", authRouter);

// /user/signup

mongoose
  .connect("mongodb://127.0.0.1:27017/authentication")
  .then(() => console.log("Connected to the authentication database!"))
  .catch((err) => console.log("Something went wrong with db connection!", err));

app.use((error, req, res, next) => {
  res.status(400).json({ error: error.message });
});

app.listen(8080, () => console.log("localhost:8080"));
