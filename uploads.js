const multer = require("multer");
const crypto = require("crypto");
const path = require("path");


const upload =multer({
  storage: multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, "uploads/");
    },
    filename: (req, file, cb)=>{
      const fileName = `${Math.floor(Math.random()*1000000)}-${crypto.randomBytes(4).toString("hex")}-${path.extname(file.originalname)}`
      cb(null, fileName);
    }
  })
})



app.post("/upload", upload.single("image"),async(req, res)=>{
    try {
      res.send("Working on it!");    
    } catch (error) {
      
    }
  });