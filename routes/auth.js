const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { login, register } = require("../controller/auth");


 

router.post("/login",login);
router.post("/register",register);

module.exports = router;
