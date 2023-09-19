const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  getUsers,
  loginUser,
  signupUser,
  getCartItems,
  addToCart,
  deleteCartItem,
} = require("../db/users");

// POST - api/users/user/login - Login User
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
      res.json({ message: "Wrong email or password! Please try again" });
    }
  } catch (error) {
    res.json(error);
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
      res.json({ message: "Wrong email or password! Please try again" });
    }
  } catch (error) {
    res.json(error);
  }
});

// GET - api/users/user/cart return the cart items
router.post("/user/cart/", async (req, res) => {
  try {
    const cartItems = await getCartItems(req.body.email);
    res.json(cartItems);
  } catch (error) {
    res.status(400).send(error);
  }
});

// POST - api/users/user/cart/add add an item to the users cart
router.post("/user/cart/add", async (req, res) => {
  try {
    const bearer = req.headers.authorization.indexOf("Bearer");
    if (bearer === 0 && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.WEB_TOKEN);
      if (decoded.email) {
        const response = await addToCart(req.body);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// POST - api/users/user/cart/delete delete an item to the users cart
router.delete("/user/cart/delete", async (req, res) => {
  try {
    const bearer = req.headers.authorization.indexOf("Bearer");
    if (bearer === 0 && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.WEB_TOKEN);
      if (decoded.email) {
        await deleteCartItem(req.body.cartItemId);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
