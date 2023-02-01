const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  console.log({ token: token });

  if (!token) return res.status(401).json("Please log IN");
  const accessToken = token.split(" ")[1];

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json("Invalid Token");
    req.user = user;
    console.log(req.user);
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    }else{
      res.status(403).json("You are not allowed to do that")
    }
  });
};

module.exports = { verifyToken, verifyUser };
