const express = require('express');
const db = require('./proxy/database-proxy');
const UserService = require('./core/user-service');
const registerSchema = require('./schema/register');
const loginSchema = require('./schema/login');
const { validationResult } = require('express-validator');

const app = express();
app.use(express.json());

const sequelize = db.getSequelizeInstance();
sequelize.sync();

app.get('/ping', (req, res) => {
  return res.sendStatus(200);
});

app.post('/register', ...registerSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(errors[0].statusCode).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  const error = await UserService.createUser(username, email, password);
  return error ? res.sendStatus(errors[0].statusCode) : res.sendStatus(200);
});

app.post('/login', ...loginSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(errors[0].statusCode).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  const [token, error] = await UserService.loginUser(username, email, password);
  console.log(error);
  return error ? res.sendStatus(error.statusCode) : res.sendStatus(200).json({'token': token});
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});