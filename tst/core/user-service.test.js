const bcrypt = require('bcryptjs');
const User = require('../../model/user');
const UserService = require("../../core/user-service");
const { PASSWORD_SALT } = require('../../constants/config');


jest.mock('bcryptjs');
jest.mock('../../model/user');

const username = 'testuser';
const email = 'testuser@example.com';
const password = 'password123';
const hashedPassword = 'hashedPassword123';

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
    const creationError = new Error('User creation failed');
    bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);
    User.create.mockRejectedValue(creationError);

    const error = await UserService.createUser(username, email, password);

    expect(User.create).toBeCalledWith({username, email, hashedPassword});
    expect(error).toBe(creationError);
  });
});