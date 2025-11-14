
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../modals/UserModel");

exports.signupHandler = async (req, res) => {
    try {
      let { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password)
        throw new Error("Missing required fields!");
  
      // if(password.length<8) throw new Error("Password must be at least 8 characters long");
  
      password = await bcrypt.hash(password, 12);
  
      const createdUser = await User.create({ name, email, phone, password });
      createdUser.password = undefined;
      res.status(201).json({ message: createdUser });
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
  }


  exports.loginHandler = async (req, res) => {
    try {
      const { email, password } = req.body;

    
      if (!email || !password) throw new Error("Invalid credentials!");
      const user = await User.findOne({ email }).select("+password");
      if (!user) throw new Error("Invalid credentials!");
 
      const correctPass = await bcrypt.compare(password, user.password);
      if (!correctPass) throw new Error("Invalid credentials!");
  
  
      const token = await jwt.sign({userId: user._id}, "mysecretkey", {expiresIn: "90d"});
      res.cookie("jwt", token, {maxAge: 1000*60*60*24*90});
  
      res.status(200).json({message: "Logged In!"});
  
    } catch (error) {
      console.log(error);
      res.status(400).json({message: error.message})
    }
  }
  

  exports.profileHandler = async(req, res)=>{
    try {  
        res.status(200).json({user: req.user});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.logoutHandler = async(req, res)=>{
  try {
      res.cookie("jwt", "", {maxAge: 10000});
      res.status(200).json({message: "You are logged out now!"});
  } catch (error) {
      res.status(400).json({error: error.message});
  }
}

exports.protect = async(req, res, next)=>{
  try {
    const token = req.cookies.jwt;
    if(!token) throw new Error("Unauthorized!");

    const payload = await jwt.verify(token, "mysecretkey");
    const userId = payload.userId;
    const user = await User.findOne({_id: userId});

    if(!user) throw new Error("Invalid token!");
    req.user = user;
    
    next();
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}


exports.restrictToAdmin = (req, res, next)=>{
  try {
    const user = req.user;
    if(user.role!="admin") throw new Error("You are not allowed to perform this action!");

    next();
  } catch (error) {
    res.status(401).json({error: error.message});
  }
}