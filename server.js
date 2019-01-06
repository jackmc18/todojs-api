const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

// const db = knex({
//   client: 'pg',
//   connection: config.SMART_BRAIN_DB,
// });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('this is working')
})

// app.get('/', (req, res) => { res.send(database.users) });
// app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.listen(3000, () => {
  console.log('running on port 3000')
})