const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("Invalid email");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return res.status(401).json("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    res.status(500).json({ error: err.msg });
  }
};

const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const newUser = new User({
      ...req.body,
      friends: [],
      password: hashedPassword,
      picturePath: req.body.picturePath,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
console.log(savedUser);
    const token = new Token({
      userId: savedUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    const savedToken = await token.save();

    const url = `${process.env.BASE_URL}/users/${savedUser._id}/verify/${savedToken.token}`;

    await sendMail(savedUser.email,"Verify Email",url)
    
    res.status(200).json({message: "An email sent to account ,Please Verify"});
  } catch (err) {
    res.status(500).json({ error: err.msg });
  }
};

module.exports = { register, login };
