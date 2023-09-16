const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUsers, loginUser, signupUser } = require("../db/users");

// GET - api/users/user/login - Login User
router.post("/user/login", async (req, res) => {
  try {
    const check = await loginUser(req.body);
    if (check) {
      const accessToken = jwt.sign(
        { email: req.body.email },
        process.env.WEB_TOKEN,
        { expiresIn: "5h" }
      );
      res.json({ accessToken });
    } else {
      res.send("Wrong email or password! Please try again");
    }
  } catch (error) {
    res.send(error.detail);
    throw error;
  }
});

// POST - api/users/user/signup - post user
router.post("/user/signup", async (req, res) => {
  try {
    const user = await signupUser(req.body);
    const check = await loginUser(req.body);
    if (check) {
      const accessToken = jwt.sign(
        { email: loginUser.email },
        process.env.WEB_TOKEN,
        { expiresIn: "5h" }
      );
      res.json({ accessToken });
    } else {
      res.send("Wrong email or password! Please try again");
    }
  } catch (error) {
    res.send(error.detail);
  }
});

router.post("/user/cart/add", async (req, res) => {
  try {
    const bearer = req.headers.authorization.indexOf("Bearer");
    if (bearer === 0 && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.WEB_TOKEN);
      if (decoded.email) {
        // Get user_id using the email that is saved in local storage
        // With the user_id get the cart_id
        // With this cart_id add the item to the cart_items table
        res.send(decoded);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/user/cart/delete", async (req, res) => {
  try {
    const bearer = req.headers.authorization.indexOf("Bearer");
    if (bearer === 0 && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.WEB_TOKEN);
      if (decoded.email) {
        // Get user_id using the email that is saved in local storage
        // With the user_id get the cart_id
        // With this cart_id remove the item from the cart_items table
        res.send(decoded);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
