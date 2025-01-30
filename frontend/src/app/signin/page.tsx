"use client";
import '@/app/ui/global.css';
import React, { useState, useEffect } from "react";
import styles from '@/app/signin/page.module.css';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import dbConnect from '@/lib/dbConnect';


const formSchema = z.object({
  email: z.string().email('Invalid Email Please enter valid email'),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});
// https://stackoverflow.com/questions/73695535/how-to-check-confirm-password-with-zod

type FormValues = z.infer<typeof formSchema>;




const LoginPage: React.FC =  () => {
  useEffect(() => {
    const formFields = document.querySelectorAll("input");

    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement;
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    formFields.forEach((field) => {
      field.addEventListener("focus", handleFocus);
    });

    return () => {
      formFields.forEach((field) => {
        field.removeEventListener("focus", handleFocus);
      });
    };
  }, []);

  const methods = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  })
  const onSubmit = async (data: { email: string; password: string; }) => {
    const { email, password } = data; // Extract relevant data
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Sign-in successful!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred.");
    }
  };
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  return (
      <div className={styles.forms}>
        <div className={styles.formsgrid}>
          <h1 className='my-5 text-2xl flex flex-row  justify-center items-center flex items-center text-5xl font-extrabold dark:text-white'>Sign In</h1>
          <Form  {...methods}>

            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field} className='mb-10' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <FormField
        name="password"
        control={methods.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...field}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="text-gray-500"                    
                    width="20"
                  />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="confirmPassword"
        control={methods.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...field}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="text-gray-500"
                    width="20"
                  />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
            <div className="flex justify-between mt-3">
            <p className='text-sm flex items-center align-bottom'>Register anonymously</p>
            <button className='underline whitespace-nowrap font-bold' onClick={ ()=> { 
              // console.log('--------',process.env.MONGODB_URI);
              router.push('/apply') }}>Register</button>
            </div>
            
            <Button className='rounded bg-black text-white w-full my-5 mt-11' onClick={methods.handleSubmit(() => {
              router.push("/apply");
            })}
              type="submit"
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
  );
};
export default LoginPage;
