const express = require('express');
const UserService = require('./core/user-service');
const registerSchema = require('./schema/register');
const loginSchema = require('./schema/login');
const { validationResult } = require('express-validator');
const initializeDatabase = require('./proxy/init-db');
const createActivitySchema = require('./schema/create-activity');
const ActivityService = require('./core/activity-service');

const app = express();
app.use(express.json());

initializeDatabase();

app.get('/ping', (req, res) => {
  return res.sendStatus(200);
});

app.post('/register', ...registerSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  let [user, error] = await UserService.createUser(username, email, password);
  if (error) { return res.sendStatus(error.statusCode) }
  
  error = await ActivityService.createUserActivities(user);
  if (error) {
    UserService.deleteUser(user);
    return res.sendStatus(error.statusCode);
  }
  return res.sendStatus(200);
});

app.post('/login', ...loginSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;
  const [token, error] = await UserService.loginUser(username, email, password);
  return error ? res.sendStatus(error.statusCode) : res.status(200).json({'token': token});
});

app.post('/activity', ...createActivitySchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, duration, content, categoryId, difficultyLevelId } = req.body;
  let [activity, error] = await ActivityService.createActivity(title, description, duration, 
    content, categoryId, difficultyLevelId);
  if (error) { res.sendStatus(error.statusCode) };

  error = await UserService.createUserActivities(activity);
  if (error) {
    ActivityService.deleteActivity(activity);
    return res.sendStatus(error.statusCode);
  }
  return res.sendStatus(200);
});

app.listen(3000, () => {
  console.info('Server is running on port 3000');
});