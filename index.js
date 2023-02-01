const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const { register } = require("./controller/auth");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const storage = multer.diskStorage({
 
//   destination:function (req, file, cb) {
//     cb(null, "/public/images");
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

app.post("/auth/register", register);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI).then(() =>
  app.listen(5000, () => {
    console.log("connected");
  })
);
