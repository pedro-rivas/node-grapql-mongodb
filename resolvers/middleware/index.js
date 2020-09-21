const { skip } = require('graphql-resolvers');

const Recipie = require('../../database/models/recipie');
const { isValidObjectId } = require('../../database/util/');

module.exports.isAuthenticated = (_, __, { email }) => {
    if(!email){
        throw new Error('Access Denied, you need to login');
    }else{
        return skip;
    }
}

module.exports.isRecipieOwner = async (_, { id }, { loggedInUserId }) => {
    try {
        if(!isValidObjectId(id)){
            throw new Error('id no valid');
        }else{
            const recipie = await Recipie.findById(id);
            if(!recipie){
                throw new Error('recipie not found');
            }else if(recipie.user.toString() !== loggedInUserId){
                throw new Error('you can not access this');
                }else{
                    return skip;
                } 
        }
    } catch (error) {
        throw error;
    }
}