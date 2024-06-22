const bcrypt = require('bcryptjs');
const { PASSWORD_SALT, JWT_EXPIRY_HOURS, JWT_SECRET_KEY} = require('../constants/config');
const User = require('../model/user');
const { InputError } = require('../constants/errors');
const { where } = require('sequelize');
const { USER_NOT_FOUND, INVALID_CREDENTIALS } = require('../constants/error-messages');
const jwt = require('jsonwebtoken');

class UserService {
    static async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);
        try {
            await User.create({username: username, email: email, password: hashedPassword});
            return null;
        } catch (error) {
            return new InputError(error.message);
        }
    }

    static async loginUser(username, email, password) {
        const user = await this.#findUser(username, email);
        if (!user) return [null, new InputError(USER_NOT_FOUND)];
        if (!await this.#validatePassword(user, password)) return [null, new InputError(INVALID_CREDENTIALS)];
        return [jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY_HOURS }), null];
    }

    static async #findUser(username, email) {
        return username ? 
        await this.#findByUsername(username) : 
        await this.#findByEmail(email);
    }

    static async #findByUsername(username) {
        return await User.findOne({where: {username: username}});
    }

    static async #findByEmail(email) {
        return await User.findOne({where: {email: email}});
    }

    static async #validatePassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }
}

module.exports = UserService