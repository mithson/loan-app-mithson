import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { FormDatas } from "../model/User.js"
import userSchema from "../model/User.js"
import { dbConnect } from "./dbConnect.js"
import mongoose from 'mongoose';

import dotenv from "dotenv";
dotenv.config();

type User = {
  personalDetails: PersonalDetails
  employmentDetails: EmploymentDetails
  otherDetails: OtherDetails
}


type PersonalDetails = {
  name: String
  email: String
  phone: String
}

type EmploymentDetails = {
  employerName: String
  income: number
  position: String
}

type OtherDetails = {
  pan: String
  aadhaar: String
  comments: String
}


// Define the GraphQL schema
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

// Define resolvers
const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        return await FormDatas.find(); // Fetch all users
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    getUser: async (_: unknown, id: string) => {
      try {
        const user = await FormDatas.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
          throw new Error("User not found FROM Mithson Backend");
        }
        return user;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    deleteUser: async (_: unknown, id: string) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("Invalid ObjectId format");
        }
        const deletedUser = await FormDatas.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        if (!deletedUser) {
          throw new Error("User not found");
        }
        return deletedUser;
      } catch (error: any) {
        throw new Error(`Error deleting user: ${error.message}`);
      }
    },
    updateUser: async (
      _: unknown,
      { id, input }: { id: string; input: User },
    ) => {
      try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error("Invalid user ID");
        }

        // Find user by ID and update fields
        const updatedUser = await FormDatas.findByIdAndUpdate(
          id,
          { $set: input },
          // { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (error: any) {
        throw new Error(`Error updating user: ${error.message}`);
      }
    },
    addUser: async (
      _: unknown,
      { input }: { input: User }, // ✅ Correctly extract `input`
    ) => {
      try { 
        const newUser = new FormDatas(input);
        await newUser.save();
        return newUser;
      } catch (error: any) {
        console.error('error---------',error)
      }
    }
  },
  
};

// Initialize the Apollo Server 
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

try {
  await dbConnect();
  console.log(`✔️  Server ready at: ${url}`);
} catch (error) {
  console.log('error occured - ', error)
}
