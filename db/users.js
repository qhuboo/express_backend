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
      `INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *;`,
      [body.first_name, body.last_name, body.email, hash]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { getUsers, loginUser, signupUser };
