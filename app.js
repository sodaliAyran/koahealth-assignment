const express = require('express');
const json = require('body-parser');
const UserService = require('./core/user-service');
const registerSchema = require('./schema/register');

const app = express();

app.post('/register', registerSchema, async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const error = await UserService.createUser(username, email, password);

  if (!error){
    return res.status(200)
  } else {
    return res.status(400)
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});