"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
    id: number;
    name: string;
    loanAmount: number;
    status: string;
}

const initialData: User[] = [
    { id: 1, name: 'MithsonAbhi', loanAmount: 5000, status: 'Approved' },
    { id: 2, name: 'Aman Rajbhar', loanAmount: 3000, status: 'Pending' },
    { id: 3, name: 'Raj.', loanAmount: 7000, status: 'Rejected' },
    { id: 5, name: 'Sandy P', loanAmount: 3000, status: 'Pending' },
    { id: 4, name: 'MithsonAbhi', loanAmount: 5000, status: 'Approved' },
    { id: 6, name: 'Aman Rajbhar', loanAmount: 3000, status: 'Pending' },
    { id: 7, name: 'Raj.', loanAmount: 7000, status: 'Rejected' },
    { id: 8, name: 'MithsonAbhi', loanAmount: 5000, status: 'Approved' },
    { id: 9, name: 'Aman Rajbhar', loanAmount: 3000, status: 'Pending' },
    { id: 10, name: 'Raj.', loanAmount: 7000, status: 'Rejected' },
];

const ShowAllUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialData);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editData, setEditData] = useState<User | null>(null);

    const handleDelete = (id: number) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    const handleEdit = (user: User) => {
        setIsEditing(user.id);
        setEditData(user);
    };

    const handleSave = () => {
        if (editData) {
            setUsers(
                users.map((user) => (user.id === editData.id ? editData : user))
            );
            setIsEditing(null);
            setEditData(null);
        }
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditData(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof User
    ) => {
        if (editData) {
            setEditData({ ...editData, [field]: e.target.value });
        }
    };

    return (
        <>
            <div className=" h-4/5 scrollbar-hide px-10 pt-10 flex flex-col items-start justify-center">
            <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl  ">Users Loan Applications</h1>
                 <div className='overflow-auto w-full h-full scrollbar-hide'>   
                <table className="overflow-scroll scrollbar-hide text-center min-w-full bg-white border border-gray-300">
                    <thead className='overflow-auto'>
                        <tr>
                            <th className="py-2 px-2 border-b">ID</th>
                            <th className="py-2 px-2 border-b">Name</th>
                            <th className="py-2 px-2 border-b">Loan Amount</th>
                            <th className="py-2 px-2 border-b">Status</th>
                            <th className="py-2 px-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="py-2 px-2 border-b">{user.id}</td>
                                <td className="py-2 px-2 border-b">
                                    {isEditing === user.id ? (
                                        <Input
                                            value={editData?.name || ''}
                                            onChange={(e) => handleChange(e, 'name')}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="py-2 px-2 border-b">
                                    {isEditing === user.id ? (
                                        <Input
                                            value={editData?.loanAmount || ''}
                                            onChange={(e) => handleChange(e, 'loanAmount')}
                                            type="number"
                                        />
                                    ) : (
                                        `$${user.loanAmount}`
                                    )}
                                </td>
                                <td className="py-2 px-2 border-b">
                                    {isEditing === user.id ? (
                                        <Input
                                            value={editData?.status || ''}
                                            onChange={(e) => handleChange(e, 'status')}
                                        />
                                    ) : (
                                        user.status
                                    )}
                                </td>
                                <td className=" py-2 px-2 border-b flex justify-center gap-2">
                                    {isEditing === user.id ? (
                                        <>
                                            <Button onClick={handleSave}>Save</Button>
                                            <Button variant="secondary" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => handleEdit(user)}>Edit</Button>
                                            <Button
                                                className="bg-red-800"
                                                variant="destructive"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </>
    );
};

export default ShowAllUsers;
