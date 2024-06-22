const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const  UserService = require("../../core/user-service");
const { PASSWORD_SALT } = require('../../constants/config');
const { InputError } = require('../../constants/errors');


jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../model/user');

const username = 'testuser';
const email = 'testuser@example.com';
const password = 'password123';
const hashedPassword = 'hashedPassword123';
const jwtToken = 'token';

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createUser", () => {
  it("should create a user successfully", async () => {
    bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);

    UserService.createUser(username, email, password);

    expect(User.create).toBeCalledWith({username, email, hashedPassword});
  });

  it("should return error if creation fails", async () => {
    const creationError = new InputError('User creation failed');
    bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);
    User.create.mockRejectedValue(creationError);

    const error = await UserService.createUser(username, email, password);

    expect(User.create).toBeCalledWith({username, email, hashedPassword});
    expect(error).toStrictEqual(creationError);
  });
});

describe("loginUser", () => {
  it("should create a jwt token", async () => {
    jwt.sign = jest.fn().mockReturnValue(jwtToken);
    bcrypt.compare = jest.fn().mockReturnValue(true);
    User.findOne.mockReturnValue({username: username, password: hashedPassword});

    const [token, error] = await UserService.loginUser(username, '', password);

    expect(User.findOne).toBeCalledWith({where: {username: username}});
    expect(error).toBe(null);
    expect(token).toBe(jwtToken);
  });
});