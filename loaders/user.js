const User = require('../database/models/user');

module.exports.batchUsers = async (userIds) => {
    try {
        console.log(userIds);
        const users = await User.find({ _id: { $in: userIds } });
        return userIds.map(userId => users.find(user => user.id === userId));
    } catch (error) {
        throw error;
    }
}