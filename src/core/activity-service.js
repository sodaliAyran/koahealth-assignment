const { INTERNAL_SERVER_ERROR, CATEGORY_NOT_FOUND, DIFFICULTY_NOT_FOUND, ACTIVITY_NOT_FOUND } = require("../constants/error-messages");
const { InputError, InternalError, NotFoundError } = require("../constants/errors");
const { Activity, UserActivity, Category, DifficultyLevel } = require("../models");

class ActivityService {
    static async getUserActivities(userId) {
        try {
            const activities = await UserActivity.findAll({where: {
                userId: userId}, 
                include: [{model: Activity, include: [Category, DifficultyLevel]}]
            });
            return [activities, null];
        } catch (error) {
            return [null, new InternalError(error.message)];
        }
    }

    static async getUserCompletedActivities(userId) {
        try {
            const activities = await UserActivity.findAll({where: {
                userId: userId, isCompleted: true}, 
                include: [{model: Activity, include: [Category, DifficultyLevel]}]
            });
            return [activities, null];
        } catch (error) {
            return [null, new InternalError(error.message)];
        }
    }

    static async createUserActivities(user) {
        try {
            const activities = await Activity.findAll();
            const userActivityPromises = activities.map(activity => {
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

    static async createActivity(values) {

        const category = await Category.findByPk(values.categoryId);
        if (!category) {return [null, new InputError(CATEGORY_NOT_FOUND)]}

        const difficultyLevel = await DifficultyLevel.findByPk(values.difficultyLevelId);
        if (!difficultyLevel) {return [null, new InputError(DIFFICULTY_NOT_FOUND)]}

        try {
            const activity = await Activity.create(values);
            return [activity, null];
        } catch (error) {
            return [null, new InternalError(INTERNAL_SERVER_ERROR)];
        }
    }
    static async deleteActivity(activity) {
        Activity.destroy({where: {id: activity.id}});
    }

    static async getActivity(activityId) {
        const activity = await Activity.findByPk(activityId, {include: [Category, DifficultyLevel]});
        return activity ? [activity, null] : [null, new NotFoundError(ACTIVITY_NOT_FOUND)]
    }

    static async updateActivity(id, values) {
        if (values.categoryId) {
            const category = await Category.findByPk(values.categoryId);
            if (!category) {return [null, new InputError(CATEGORY_NOT_FOUND)]};
        }
        if (values.difficultyLevelId) {
            const difficultyLevel = await DifficultyLevel.findByPk(values.difficultyLevelId);
            if (!difficultyLevel) {return [null, new InputError(DIFFICULTY_NOT_FOUND)]}
        }
        try {
            const [affectedRows] = await Activity.update(values, {where: {id: id}});
            if (affectedRows > 0) {
                return [await Activity.findByPk(id, {include: [Category, DifficultyLevel]}), null];
            }
            return [null, new NotFoundError(ACTIVITY_NOT_FOUND)];
        } catch (error) {
            return [null, new InternalError(error.message)];
        }
    }

    static async updateUserActivity(id, values) {
        try {
            const [affectedRows] = await UserActivity.update(values, {where: {id: id}});
            if (affectedRows > 0) {
                return null;
            }
            return new NotFoundError(ACTIVITY_NOT_FOUND);
        } catch (error) {
            return new InternalError(error.message);
        }
    }
}

module.exports = ActivityService