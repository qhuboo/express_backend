const { system } = require("nodemon/lib/config");
const client = require("./client");
const bcrypt = require("bcrypt");

// GET - users/ - get user
async function getUsers() {
  try {
    const { rows } = await client.query(`SELECT * FROM users`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function loginUser(body) {
  try {
    console.log(body);
    const { rows } = await client.query(
      `SELECT password FROM users WHERE email = $1`,
      [body.email]
    );
    if (rows[0]) {
      const hash = rows[0].password;
      if (bcrypt.compareSync(body.password, hash)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

// POST - users/user/ - post user
async function signupUser(body) {
  const hash = bcrypt.hashSync(body.password, 10);
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users(email, password) VALUES($1, $2) RETURNING *;`,
      [body.email, hash]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

// POST - users/user/cart/add - add product to cart
async function addToCart(product) {
  try {
    const response = await client.query(`INSERT INTO cart_items`);
  } catch (error) {
    throw error;
  }
}

module.exports = { getUsers, loginUser, signupUser, addToCart };
