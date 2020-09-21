const { GraphQLDateTime } = require('graphql-iso-date');

const usersResolver = require('./users');
const recipiesResolver = require('./recipies');

const customDateScalarResolver = { Date: GraphQLDateTime };

module.exports = [
    usersResolver,
    recipiesResolver,
    customDateScalarResolver,
];