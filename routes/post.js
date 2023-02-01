const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const { verifyToken } = require("./verifyToken");
const router = express.Router();

router.post("/new", verifyToken, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.body.userId);

    const newPost = new Post({
      userId: req.body.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      description: req.body.description,
      picturePath: user.picturePath,
      location: user.location,
      postPicturePath: req.body.postPicturePath,
      likes: {},
      comments: [],
    });

    const savedPost = await newPost.save();
    console.log(savedPost);
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.userId });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/like/", verifyToken, async (req, res) => {
  console.log({ body: req.body });
  const { userId, postId } = req.body;

  try {
    const post = await Post.findById(postId);

    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        likes: post.likes,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
