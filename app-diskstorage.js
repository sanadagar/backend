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




const upload =multer({
  storage: multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, "uploads/");
    },
    filename: (req, file, cb)=>{
      const fileName = `${Math.floor(Math.random()*1000000)}-${crypto.randomBytes(4).toString("hex")}-${path.extname(file.originalname)}`
      cb(null, fileName);
    },
   
  }),

  fileFilter: (req, file, cb)=>{
    const allowedMimes = ["image/png", "image/jpg", "image/jpeg"];
    const valid = allowedMimes.includes(file.mimetype);
    if(!valid) 
      cb(new Error("Only png, jpeg and jpg images are allowed"), false);
    else cb(null, true);
  }
})

// console.log("tas.hif.pdf".split(".").at(-1));
console.log()

app.post("/upload", upload.single("image"),async(req, res)=>{
  try {
    res.send("Working on it!");    
  } catch (error) {
    res.status(400).json({error: error.message})
  }
});



app.use("/user", authRouter);

// /user/signup

mongoose
  .connect("mongodb://127.0.0.1:27017/authentication")
  .then(() => console.log("Connected to the authentication database!"))
  .catch((err) => console.log("Something went wrong with db connection!", err));




app.use((error, req, res, next)=>{
  res.status(400).json({error: error.message})
})


app.listen(8080, () => console.log("localhost:8080"));
