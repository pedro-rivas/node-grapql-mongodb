const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const Dataloader = require('dataloader');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/util/');
const { verifyUser } = require('./helper/context/');
const loaders = require('./loaders/');
  
dotEnv.config();

const app = express();
app.use(cors());
app.use(express.json());

connection();

const apolloServer = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: async ({ req }) => {
        const contextObj = {};
        if(req){
            await verifyUser(req);
            contextObj.email= req.email;
            contextObj.loggedInUserId = req.loggedInUserId;
        }
        contextObj.loaders = {
            user: new Dataloader(keys => loaders.user.batchUsers(keys))
        }
        return contextObj;
    },
    formatError: ({ message }) => {
        return {
            message
        };
    }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{ 
    console.log(apolloServer.graphqlPath); 
});
