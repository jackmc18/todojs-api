const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const auth = require("./middlewares/authorization");

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("this is working");
});

app.post("/signin", (req, res) => {
  signin.handleAuth(req, res, db, bcrypt, jwt);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.get("/boardlist/", auth.requireAuth, (req, res) => {
  console.log("getting boardlist");
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
