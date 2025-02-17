"use client"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ✅ Zod Schema for Validation
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  loanAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Loan Amount is required")
  ),
  status: z.string().min(1, "Status is required"),
});

// ✅ TypeScript Interfaces
interface User {
  id: string;
  name: string;
  loanAmount: number;
  status: string;
}

interface GraphQLResponse<T> {
  data: T;
}

interface UserInput {
  name: string;
  loanAmount: number;
  status: string;
}

// ✅ GraphQL Queries & Mutations
const FETCH_USERS_QUERY = `
  query {
    getAllUsers {
      id
      personalDetails { name }
      employmentDetails { income }
      otherDetails { comments }
    }
  }
`;

const ADD_USER_MUTATION = `
  mutation ($input: AddUserInput!) {
    addUser(input: $input) {
      id
      personalDetails { name }
      employmentDetails { income }
      otherDetails { comments }
    }
  }
`;

const UPDATE_USER_MUTATION = `
  mutation ($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      personalDetails { name }
      employmentDetails { income }
      otherDetails { comments }
    }
  }
`;

const DELETE_USER_MUTATION = `
  mutation ($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

// ✅ Fetch GraphQL Data
const fetchGraphQL = async <T,>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> => {
  const response = await fetch("http://localhost:4000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const result: GraphQLResponse<T> = await response.json();
  return result.data;
};

// ✅ Component: Users Loan Applications
export default function UsersLoanApplications() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // ✅ React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", loanAmount: 0, status: "" },
  });

  // ✅ Fetch Users on Mount
  useEffect(() => {
    fetchGraphQL<{ getAllUsers: any[] }>(FETCH_USERS_QUERY).then((data) => {
      setUsers(
        data.getAllUsers.map((user) => ({
          id: user.id,
          name: user.personalDetails.name,
          loanAmount: user.employmentDetails.income,
          status: user.otherDetails.comments,
        }))
      );
    });
  }, []);

  // ✅ Handle User Submission (Add / Update)
  const onSubmit = async (data: UserInput) => {
    if (editingUserId) {
      // Update existing user
      await fetchGraphQL(UPDATE_USER_MUTATION, {
        id: editingUserId,
        input: {
          personalDetails: { name: data.name },
          employmentDetails: { income: Number(data.loanAmount) },
          otherDetails: { comments: data.status },
        },
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId ? { ...user, ...data } : user
        )
      );
    } else {
      // Add new user
      const response = await fetchGraphQL<{ addUser: User }>(ADD_USER_MUTATION, {
        input: {
          personalDetails: { name: data.name },
          employmentDetails: { income: Number(data.loanAmount) },
          otherDetails: { comments: data.status },
        },
      });
      setUsers((prev) => [...prev, response.addUser]);
    }

    reset();
    setEditingUserId(null);
  };

  // ✅ Handle Edit Click
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setValue("name", user.name);
    setValue("loanAmount", user.loanAmount);
    setValue("status", user.status);
  };

  // ✅ Handle Delete Click
  const handleDelete = async (id: string) => {
    await fetchGraphQL(DELETE_USER_MUTATION, { id });
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="h-4/5 px-10 pt-10 flex flex-col items-start justify-center">
      <h1 className="mb-6 text-4xl font-extrabold text-gray-900">Users Loan Applications</h1>

      {/* ✅ User Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex gap-2">
        <Input placeholder="Name" {...register("name")} />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        <Input type="number" placeholder="Loan Amount" {...register("loanAmount")} />
        {errors.loanAmount && <span className="text-red-500">{errors.loanAmount.message}</span>}

        <Input placeholder="Status" {...register("status")} />
        {errors.status && <span className="text-red-500">{errors.status.message}</span>}

        <Button type="submit">{editingUserId ? "Update" : "Add"}</Button>
      </form>

      {/* ✅ Display Users Table */}
      <div className="overflow-auto w-full h-full">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b">ID</th>
              <th className="py-2 px-2 border-b">Name</th>
              <th className="py-2 px-2 border-b">Loan Amount</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-2 border-b">{user.id}</td>
                <td className="py-2 px-2 border-b">{user.name}</td>
                <td className="py-2 px-2 border-b">${user.loanAmount}</td>
                <td className="py-2 px-2 border-b">{user.status}</td>
                <td className="py-2 px-2 border-b flex justify-center gap-2">
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
                  <Button className="bg-red-800" variant="destructive" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
