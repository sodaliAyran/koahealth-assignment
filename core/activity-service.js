const { INTERNAL_SERVER_ERROR, CATEGORY_NOT_FOUND, DIFFICULTY_NOT_FOUND } = require("../constants/error-messages");
const { InputError, InternalError } = require("../constants/errors");
const { Activity, UserActivity, Category, DifficultyLevel } = require("../models");

class ActivityService {
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

    static async createActivity(title, description, duration, 
        content, categoryId, difficultyLevelId) {

        const category = await Category.findOne({where: {id: categoryId}});
        if (!category) {return [null, InputError(CATEGORY_NOT_FOUND)]}

        const difficultyLevel = await DifficultyLevel.findOne({where: {id: difficultyLevelId}});
        if (!difficultyLevel) {return [null, InputError(DIFFICULTY_NOT_FOUND)]}

        try {
            const activity = await Activity.create({
                title: title,
                description: description,
                duration: duration,
                content: content,
                categoryId: category.id,
                difficultyLevelId: difficultyLevel.id
            });
            return [activity, null];
        } catch (error) {
            return [null, new InternalError(INTERNAL_SERVER_ERROR)];
        }
    }
    static async deleteActivity(activity) {
        Activity.destroy({where: {id: activity.id}});
    }
}

module.exports = ActivityService