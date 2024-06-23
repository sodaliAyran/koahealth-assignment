const express = require('express');
const UserService = require('./core/user-service');
const registerSchema = require('./schema/register');
const loginSchema = require('./schema/login');
const { validationResult } = require('express-validator');
const initializeDatabase = require('./proxy/init-db');
const createActivitySchema = require('./schema/create-activity');
const ActivityService = require('./core/activity-service');
const updateActivitySchema = require('./schema/update-activity');
const completeActivitySchema = require('./schema/complete-activity');

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
  let [user, error] = await UserService.createUser(req.body);
  if (error) return res.sendStatus(error.statusCode);
  
  error = await ActivityService.createUserActivities(user);
  if (error) {
    UserService.deleteUser(user);
    return res.sendStatus(error.statusCode);
  }
  return res.sendStatus(200);
});

app.post('/login', ...loginSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  const [token, error] = await UserService.loginUser(req.body);
  return error ? res.sendStatus(error.statusCode) : res.status(200).json({'token': token});
});

app.post('/activity', ...createActivitySchema, async (req, res) => {
  let [_, error] = UserService.authUser(req.headers['authorization']);
  if (error) return res.sendStatus(error.statusCode);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  [activity, error] = await ActivityService.createActivity(req.body);
  if (error) res.sendStatus(error.statusCode);

  error = await UserService.createUserActivities(activity);
  if (error) {
    ActivityService.deleteActivity(activity);
    return res.sendStatus(error.statusCode);
  }
  return res.sendStatus(200);
});

app.get('/activity/:id', async (req, res) => {
  let [_, error] = UserService.authUser(req.headers['authorization']);
  if (error) return res.sendStatus(error.statusCode);

  [activity, error] = await ActivityService.getActivity(req.params.id);
  return error ? res.sendStatus(error.statusCode) : res.status(200).json(activity);

});

app.patch('/activity/:id', ...updateActivitySchema, async (req, res) => {
  let [_, error] = UserService.authUser(req.headers['authorization']);
  if (error) return res.sendStatus(error.statusCode);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  [activity, error] = await ActivityService.updateActivity(req.params.id, req.body);
  return error ? res.sendStatus(error.statusCode) : res.status(200).json(activity);

});

app.get('/user/activities', async (req, res) => {
  let [userId, error] = UserService.authUser(req.headers['authorization']);
  if (error) return res.sendStatus(error.statusCode);

  [activities, error] = await ActivityService.getUserActivities(userId);
  return error ? res.sendStatus(error.statusCode) : res.status(200).json(activities);
});

app.get('/user/completed', async (req, res) => {
  let [userId, error] = UserService.authUser(req.headers['authorization']);
  if (error) return res.sendStatus(error.statusCode);

  [activities, error] = await ActivityService.getUserCompletedActivities(userId);
  return error ? res.sendStatus(error.statusCode) : res.status(200).json(activities);
});

app.patch('/user/activities/:id', ...completeActivitySchema, async (req, res) => {
  let [userId, error] = UserService.authUser(req.headers['authorization']);
  if (error) return res.sendStatus(error.statusCode);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  error = await ActivityService.updateUserActivity(req.params.id, req.body);
  return error ? res.sendStatus(error.statusCode) : res.sendStatus(200);
});


app.listen(3000, () => {
  console.info('Server is running on port 3000');
});