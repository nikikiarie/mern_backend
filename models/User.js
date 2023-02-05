const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    picturePath:{type:String,default:""},
    friends:{type:Array,default:""},
    location: { type: String },
    occupation: { type: String },
    viewedProfile:{type:Number},
    impressions:{type:Number},
    verified:{type:Boolean,default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
