/**
 * GraphQL Server
 * @see {@link https://www.apollographql.com/docs/apollo-server}
 */
const bodyParser = require('body-parser');
const {makeExecutableSchema} = require('graphql-tools');
const {formatErrors} = require('apollo-errors');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
//
// API test data
//
const authors = [
    {id: 1, firstName: 'Tom', lastName: 'Coleman'},
    {id: 2, firstName: 'Sashko', lastName: 'Stubailo'},
    {id: 3, firstName: 'Mikhail', lastName: 'Novikov'}
];
const posts = [
    {id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2},
    {id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3},
    {id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1},
    {id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7}
];
//
// API configuration
//
const endpointURL = '/graphql';
const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }
`;
const resolvers = {
    Query: {
        posts: () => posts,
        author: (_, {id}) => authors.find(author => (author.id === id))
    },
    Author: {
        posts: author => posts.filter(post => (post.authorId === author.id))
    },
    Post: {
        author: post => authors.find(author => (author.id === post.authorId))
    }
};
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const app = require('./server');
app
    .use('/graphiql', graphiqlExpress({endpointURL}))
    .use(endpointURL, bodyParser.json(), graphqlExpress({schema, formatErrors}));

module.exports = app;
