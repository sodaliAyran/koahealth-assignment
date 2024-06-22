const bcrypt = require('bcryptjs');
const PASSWORD_SALT = require('../constants/config');
const User = require('../model/user');

class UserService {
    static async createUser(username, email, password) {
        const hashedPassword = bcrypt.hash(password, PASSWORD_SALT);
        try {
            await User.create({username, email, hashedPassword});
            return null;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}

module.exports = UserService