import { ApolloServer } from "apollo-server-micro";
// import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { dbConnect } from "../dbConnect"; // Ensure correct path
import { FormDatas } from "../model/User"; // Ensure correct path
import Cors from "micro-cors";
import { RequestHandler } from "next/dist/server/next";

dotenv.config();

// Enable CORS
const cors = Cors({
  allowMethods: ["POST", "OPTIONS"],
});

// GraphQL Schema
const typeDefs = `#graphql
  type User {
    id: ID
    personalDetails: PersonalDetails
    employmentDetails: EmploymentDetails
    otherDetails: OtherDetails
  }

  type PersonalDetails {
    name: String
    email: String
    phone: String
  }

  type EmploymentDetails {
    employerName: String
    income: Float
    position: String
  }

  type OtherDetails {
    pan: String
    aadhaar: String
    comments: String
  }

  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
  }

  type Mutation {
    deleteUser(id: ID): User
    updateUser(id: ID!, input: UpdateUserInput): User
    addUser(input: addUserInput!): User
  }

  input addUserInput {
    personalDetails: PersonalDetailsInput
    employmentDetails: EmploymentDetailsInput
    otherDetails: OtherDetailsInput
  }

  input UpdateUserInput {
    personalDetails: PersonalDetailsInput
    employmentDetails: EmploymentDetailsInput
    otherDetails: OtherDetailsInput
  }

  input PersonalDetailsInput {
    name: String
    email: String
    phone: String
  }

  input EmploymentDetailsInput {
    employerName: String
    income: Float
    position: String
  }

  input OtherDetailsInput {
    pan: String
    aadhaar: String
    comments: String
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    getAllUsers: async () => {
      await dbConnect();
      return await FormDatas.find();
    },
    getUser: async (_: unknown, { id }: { id: string }) => {
      await dbConnect();
      return await FormDatas.findById(id);
    },
  },
  Mutation: {
    deleteUser: async (_: unknown, { id }: { id: string }) => {
      await dbConnect();
      return await FormDatas.findByIdAndDelete(id);
    },
    updateUser: async (_: unknown, { id, input }: { id: string; input: any }) => {
      await dbConnect();
      return await FormDatas.findByIdAndUpdate(id, input, { new: true });
    },
    addUser: async (_: unknown, { input }: { input: any }) => {
      await dbConnect();
      const newUser = new FormDatas(input);
      await newUser.save();
      return newUser;
    },
  },
};

// Initialize Apollo Server
const apolloServer = new ApolloServer({ typeDefs, resolvers });


const startServer = apolloServer.start();

const handler: RequestHandler = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
};

// Export the handler with CORS applied
export default cors(handler);

// Disable Next.js body parser (Apollo handles it)
export const config = {
  api: {
    bodyParser: false,
  },
};

