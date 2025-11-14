const express = require("express");
const authRoutes = express.Router();

const {signupHandler, loginHandler, profileHandler, logoutHandler, protect} = require("./../controllers/authController");


authRoutes.post("/signup", signupHandler);
authRoutes.post("/login", loginHandler);

authRoutes.use(protect);
authRoutes.get("/profile", profileHandler);
authRoutes.get("/logout", logoutHandler);

module.exports = authRoutes;
