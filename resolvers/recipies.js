const uuid = require('uuid');
const { combineResolvers } = require('graphql-resolvers');

const Recipie = require('../database/models/recipie');
const User = require('../database/models/user');
const Category = require('../database/models/category');
const { isAuthenticated, isRecipieOwner } = require('./middleware');
const loaders = require('../loaders');

module.exports = {
    Query:{
        getRecipes: combineResolvers(isAuthenticated, async () => {
            try {
                const recipies = await Recipie.find();
                return recipies;
            } catch (error) {
                throw error;
            }
        }),
        getCategories: combineResolvers(isAuthenticated, async (_, __, { loggedInUserId }) => {
            try {
                const categories = await Category.find({ user: loggedInUserId });
                return categories;
            } catch (error) {
                throw error;
            }
        }),
        getMyRecipes: combineResolvers(isAuthenticated, async (_, __, { loggedInUserId }) => {
            try {
                const recipies = await Recipie.find({ user: loggedInUserId });
                return recipies;
            } catch (error) {
                throw error;
            }
        }),
        getOneRecipe: combineResolvers(isAuthenticated, isRecipieOwner, async (_, { id }) => {
            try {
                const recipie = await Recipie.findById(id);
                return recipie;
            } catch (error) {
                throw error;
            }
        }),
        getOneCategory: combineResolvers(isAuthenticated, async (_, { id }) => {
            try {
                const category = await Category.findById(id);
                return category;
            } catch (error) {
                throw error;
            }
        }),
    },
    Mutation: {
        createRecipie: combineResolvers(isAuthenticated, async (_, { input }, { email }) => {
            try {
                const user = await User.findOne({ email });
                const category = await Category.findOne({ _id: input.category });
                const recipie = new Recipie({ ...input, user: user.id, category: category.id});
                const result = await recipie.save();
                user.recipies.push(result.id);
                await user.save();
                category.recipies.push(result.id);
                await category.save();
                return result;
            } catch (error) {
                throw error;
            }
           
        }),
        createCategory: combineResolvers(isAuthenticated, async (_, { input }, { email, loggedInUserId }) => {
             try {
                const user = await User.findOne({ email });
                const sameName = await Category.findOne({ name: input.name});
                if(sameName){
                    const sameUser =  JSON.stringify(sameName.user).includes(loggedInUserId);
                    if(sameUser){
                        throw new Error('this category allready exists');
                    }
                }
                const newCategory = new Category({ ...input, user: user.id});
                const result = await newCategory.save();
                return result;
            } catch (error) {
                throw error;
            }
        }),
        updateRecipie: combineResolvers(isAuthenticated, isRecipieOwner, async (_, { id, input }) => {
            try {
                const recipie = await Recipie.findByIdAndUpdate(id, {...input }); //?
                return recipie;
            } catch (error) {
                throw error;
            }
        }),
        // deleteTask: combineResolvers(isAuthenticated, isRecipieOwner, async (_, { id }, { loggedInUserId}) => {
        //     try {
        //         const task = await Task.findByIdAndDelete(id);
        //         await User.updateOne({ _id: loggedInUserId }, { $pull: { tasks: task.id } });
        //         return task;
        //     } catch (error) {
        //         throw error;
        //     }
        // }),
    },
    Recipie:{
        category: combineResolvers(isAuthenticated, async (parent, _, { loggedInUserId }) => {
            try {
                const category = await Category.findOne({ _id:  parent.category.toString()});
                return category;
            } catch (error) {
                throw error;
            }
        }),
        user: combineResolvers(isAuthenticated, async (parent, _, { loaders }) => {
            try {
                const user = await loaders.user.load(parent.user.toString());
                return user;
            } catch (error) {
                throw error;
            }
        }),
    },
    Category:{
        recipies: combineResolvers(isAuthenticated, async (parent) => {
            try {
                const recipies = await Recipie.find({ category: parent.id.toString()});
                return recipies;
            } catch (error) {
                throw error;
            }
        }),
    },
    User:{
        recipies: combineResolvers(isAuthenticated, async (_, __, { loggedInUserId }) => {
            try {
                const recipies = await Recipie.find({ user: loggedInUserId });
                return recipies;
            } catch (error) {
                throw error;
            }
        }),
    },
    
}