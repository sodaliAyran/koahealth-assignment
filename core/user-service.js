const bcrypt = require('bcryptjs');
const { PASSWORD_SALT, JWT_EXPIRY_HOURS, JWT_SECRET_KEY} = require('../constants/config');
const { InputError, InternalError } = require('../constants/errors');
const { where } = require('sequelize');
const { USER_NOT_FOUND, INVALID_CREDENTIALS, INTERNAL_SERVER_ERROR } = require('../constants/error-messages');
const jwt = require('jsonwebtoken');
const { User, UserActivity } = require('../models');

class UserService {
    static async createUserActivities(activity) {
        try {
            const users = await User.findAll();
            const userActivityPromises = users.map(user => {
                return UserActivity.create({
                    userId: user.id,
                    activityId: activity.id
                });
            });
                await Promise.all(userActivityPromises);
                return null;
        } catch (error) {
            return new InternalError(INTERNAL_SERVER_ERROR);
        }
    }

    static async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);
        try {
            const user = await User.create({username: username, email: email, password: hashedPassword});
            return [user, null];
        } catch (error) {
            return [null, new InputError(error.message)];
        }
    }

    static async deleteUser(user) {
        User.destroy({where: {id: user.id}})
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