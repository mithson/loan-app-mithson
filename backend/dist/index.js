import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// import { testDatabaseConnection } from '../../frontend/src/lib/crud';
// Define the GraphQL schema
const typeDefs = `#graphql
  type User {
    id: Int!
    name: String!
    loanAmount: Int!
    status: String!
  }

  type Query {
    getUsers: [User!]!
    getUser(id: Int!): User
  }

  type Mutation {
    addUser(name: String!, loanAmount: Int!, status: String!): User
    updateUser(id: Int!, name: String, loanAmount: Int, status: String): User
    deleteUser(id: Int!): Boolean
  }
`;
// Mock data
let users = [
    { id: 1, name: 'MithsonAbhi', loanAmount: 5000, status: 'Approved' },
    { id: 2, name: 'Aman Rajbhar', loanAmount: 3000, status: 'Pending' },
    { id: 3, name: 'Raj.', loanAmount: 7000, status: 'Rejected' },
    { id: 4, name: 'Sandy P', loanAmount: 3000, status: 'Pending' },
];
// Define resolvers
const resolvers = {
    Query: {
        getUsers: () => users,
        getUser: (_, { id }) => users.find((user) => user.id === id),
    },
    Mutation: {
        addUser: (_, { name, loanAmount, status }) => {
            const newUser = {
                id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
                name,
                loanAmount,
                status,
            };
            users.push(newUser);
            return newUser;
        },
        updateUser: (_, { id, name, loanAmount, status }) => {
            const userIndex = users.findIndex((user) => user.id === id);
            if (userIndex === -1)
                return null;
            users[userIndex] = {
                ...users[userIndex],
                ...(name && { name }),
                ...(loanAmount && { loanAmount }),
                ...(status && { status }),
            };
            return users[userIndex];
        },
        deleteUser: (_, { id }) => {
            const userIndex = users.findIndex((user) => user.id === id);
            if (userIndex === -1)
                return false;
            users.splice(userIndex, 1);
            return true;
        },
    },
};
// Initialize the Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers
});
// async function checkConnection() {
//   try {
//     const message = await testDatabaseConnection();
//     console.log(message); // Outputs: 'Database connection successful'
//   } catch (error) {
//     console.error(error.message); // Outputs: 'Database connection failed: <error>'
//   }
// }
// checkConnection();
// Start the server
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀 Server ready at: ${url}`);
