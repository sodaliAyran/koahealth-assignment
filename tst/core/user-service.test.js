const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  UserService = require("../../core/user-service");
const { PASSWORD_SALT } = require('../../constants/config');
const { InputError, InternalError } = require('../../constants/errors');
const { User, UserActivity } = require('../../models');


jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models');

const username = 'testuser';
const email = 'testuser@example.com';
const password = 'password123';
const hashedPassword = 'hashedPassword123';
const jwtToken = 'token';
const mockUser = {id: 1, username: username, password: hashedPassword, email: email};
const mockActivity = {id: 1, title: 'title', duration: 1, content: 'content'};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createUser", () => {
  it("should create a user successfully", async () => {
    bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);
    User.create.mockReturnValue(mockUser);

    const [user, error] = await UserService.createUser(username, email, password);
    expect(User.create).toBeCalledWith({username: username, email: email, password: hashedPassword});
    expect(error).toBe(null);
    expect(user).toBe(mockUser);
  });

  it("should return error if creation fails", async () => {
    const creationError = new InputError('User creation failed');
    bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);
    User.create.mockRejectedValue(creationError);

    const [user, error] = await UserService.createUser(username, email, password);

    expect(User.create).toBeCalledWith({username: username, email: email, password: hashedPassword});
    expect(error).toStrictEqual(creationError);
  });
});


describe("loginUser", () => {
  it("should create a jwt token", async () => {
    jwt.sign = jest.fn().mockReturnValue(jwtToken);
    bcrypt.compare = jest.fn().mockReturnValue(true);
    User.findOne.mockReturnValue(mockUser);

    const [token, error] = await UserService.loginUser(username, '', password);

    expect(User.findOne).toBeCalledWith({where: {username: username}});
    expect(error).toBe(null);
    expect(token).toBe(jwtToken);
  });
});

describe("createUserActivities", () => {
  it("should create activity relations of a user", async () => {
    User.findAll.mockReturnValue([mockUser]);

    const error = await UserService.createUserActivities(mockActivity);

    expect(User.findAll).toBeCalledWith();
    expect(UserActivity.create).toBeCalledWith({userId: mockUser.id, 
      activityId: mockActivity.id});
    expect(error).toBe(null);
  });

  it("should return error if creation fails", async () => {
    User.findAll.mockReturnValue([mockUser]);
    const creationError = new InternalError('Failed');
    UserActivity.create.mockRejectedValue(creationError);

    const error = await UserService.createUserActivities(mockActivity);

    expect(UserActivity.create).toBeCalledWith({userId: mockUser.id, 
      activityId: mockActivity.id});    
      expect(error).toStrictEqual(creationError);
  });
});