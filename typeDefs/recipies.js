const { gql } = require('apollo-server-express');

module.exports = gql`
    extend type Query{
        getMyRecipes: [Recipie!]
        getOneRecipe(id: ID!): Recipie
        getRecipes: [Recipie!]
        getCategories: [Category!]
        getOneCategory(id: ID!): Category
    }

    input createRecipieInput {
        name: String!
        description: String!
        ingredients: String!
        category: String!
    }

    input createCategoryInput {
        name: String!
    }

    extend type Mutation {
        createRecipie(input: createRecipieInput!): Recipie
        createCategory(input: createCategoryInput!): Category
        updateRecipie(id: ID!, input: updateRecipieInput!): Recipie
        # deleteTask(id: ID!): Task
    }

    input updateRecipieInput {
        name: String!
        description: String!
        ingredients: String!
        category: String!
    }

    
    type Category {
        id: ID!
        name: String!
        recipies: [Recipie!]
        user: User!
        createdAt: Date!
        updatedAt: Date!
    }

    type Recipie {
        id: ID!
        name: String!
        description: String!
        ingredients: String!
        category: Category!
        user: User!
        createdAt: Date!
        updatedAt: Date!
    }
`;
