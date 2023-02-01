const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
  
  console.log(req.body)
  try {
    const salt = await bcrypt.genSalt(10);
  const hashedPassword =await  bcrypt.hash(req.body.password, salt);
  console.log(req.body.email);
    const newUser = new User({
      ...req.body,
      friends:[],
      password: hashedPassword,
      picturePath: req.body.picturePath,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.msg });
  }
};

module.exports = { register, login };
