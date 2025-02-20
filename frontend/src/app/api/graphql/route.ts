import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { FormDatas } from "../model/User";
import { dbConnect } from "../dbConnect";
import { ApolloServer } from '@apollo/server';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Define GraphQL Schema
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
    deleteUser(id: ID): User,
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

// Resolvers
const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        return await FormDatas.find();
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    getUser: async (_: unknown, { id }: { id: string }) => {
      try {
        const user = await FormDatas.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    deleteUser: async (_: unknown, { id }: { id: string }) => {
      try {
        const deletedUser = await FormDatas.findByIdAndDelete(id);
        if (!deletedUser) {
          throw new Error("User not found");
        }
        return deletedUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    updateUser: async (_: unknown, { id, input }: { id: string; input: any }) => {
      try {
        const updatedUser = await FormDatas.findByIdAndUpdate(id, input, { new: true });
        if (!updatedUser) {
          throw new Error("User not found");
        }
        return updatedUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    addUser: async (_: unknown, { input }: { input: any }) => {
      try {
        const newUser = new FormDatas(input);
        await newUser.save();
        return newUser;
      } catch (error: any) {
        console.error("Error:", error);
      }
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Ensure the database connection
dbConnect();

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export { handler as GET, handler as POST };
