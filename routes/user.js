const express = require("express");
const { verifyToken } = require("./verifyToken");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/friend/", verifyToken, async (req, res) => {
  console.log(req.body);
  const { id, friendId } = req.body;
  if (id === friendId) {
    return res.status(401).json(`cannot add oneself as friend`);
  }

  try {
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    console.log({ friends });
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

router.get("/friends/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    console.log(user);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
