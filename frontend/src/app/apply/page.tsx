// Install dependencies before using this code:
// npm install zod react-hook-form @shadcn/ui
"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/apply/page.module.css";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation'



// Step schemas
const personalDetailsSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
});

const employmentDetailsSchema = z.object({
  employerName: z.string().nonempty("Employer name is required"),
  income: z.coerce.number().min(10_000_00, "Income must be at least 10,000,00"),
  position: z.string().nonempty("Position is required"),
});

const otherDetailsSchema = z.object({
  pan: z.string().regex(/^\w{10}$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  comments: z.string().optional(),
});

const formSchema = z.object({
  personalDetails: personalDetailsSchema,
  employmentDetails: employmentDetailsSchema,
  otherDetails: otherDetailsSchema,
});

type FormValues = z.infer<typeof formSchema>;
type FieldNames = 
  | "personalDetails.name"
  | "personalDetails.email"
  | "personalDetails.phone"
  | "employmentDetails.employerName"
  | "employmentDetails.income"
  | "employmentDetails.position";

interface StringArray {
  [index: number]: string;
}
// Multi-step form component
const MultiStepForm: React.FC = () => {
  // function putFocus() {
  //     try {
  //         document.getElementsByTagName('input').forEach((element) =>{element.scrollIntoView(true)}) 
  //     } catch (error) {
  //         console.error('----error----',error)
  //     }
  // }
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

  }, []);

  const methods = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: { name: "", email: "", phone: "" },
      employmentDetails: { employerName: "", income: 0, position: "" },
      otherDetails: { pan: "", aadhaar: "", comments: "" },
    },
  });

  const [step, setStep] = useState(0);

  const router = useRouter()



  const steps = [
    <div key="step1">
      <h1 className='my-5 text-xl flex flex-row mb-5 justify-center items-center flex items-center text-5xl font-extrabold dark:text-white'>Personal Details</h1>

      <FormField
        control={methods.control}
        name="personalDetails.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="personalDetails.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={methods.control}
        name="personalDetails.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <div className="flex items-start mb-5 mt-5">
        <div className="flex items-center h-5 ">
          <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300" required />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
      </div> */}


    </div>,
    <div key="step2">
      <h2 className="flex items-center text-2xl font-extrabold dark:text-white mb-5">Employment Details</h2>
      <FormField
        control={methods.control}
        name="employmentDetails.employerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="employmentDetails.income"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Income</FormLabel>
            <FormControl>
              <Input type="number" pattern="/d" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message</label>
      <textarea id="message" className="max-h-12 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea> */}


      <FormField
        control={methods.control}
        name="employmentDetails.position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

    </div>,
    <div key="step3">
      <h2 className="flex items-center justify-center text-2xl font-extrabold dark:text-white mb-5"> Other Details</h2>
      <FormField
        control={methods.control}
        name="otherDetails.pan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PAN</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="otherDetails.aadhaar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aadhaar</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="otherDetails.comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reason for Applying Loan</FormLabel>
            <FormControl>
              <Textarea {...field} />

            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <br />

    </div>,
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error('Failed to submit form');
  
      const result = await response.json();
      console.log('Form submitted:', result);
      router.push('/showall'); // Redirect on showall
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  


  return (
    <>
      <div style={{ overflow: "hidden"}} className={styles.formContainer}>
        <div className={styles.forms}>
          <div className={styles.formsgrid}>
            <FormProvider {...methods}>
             
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {steps[step]}
                {step == 0 && ( <div className="mt-4 mb-7 flex flex-start justify-between">
              <pre className='w-full'>Want more features...   </pre>
              <button className="underline whitespace-nowrap font-bold" onClick={()=>{router.push('/signin')}}> Sign In</button>
          
              </div> )}
               
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {step > 0 && (
                    <Button type="button" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  
                  {step < steps.length - 1 && (
                    <Button
                    className={step === 0 || step === steps.length - 1 ? "w-full mb-4" : "mb-4"}
                      type="button"
                      onClick={async () => {
                        let currentStepFields: FieldNames[] = [];

                        if (step === 0) {
                          currentStepFields = [
                            "personalDetails.name",
                            "personalDetails.email",
                            "personalDetails.phone",
                          ];
                        } else if (step === 1) {
                          currentStepFields = [
                            "employmentDetails.employerName",
                            "employmentDetails.income",
                            "employmentDetails.position",
                          ];
                        }

                        const isValid = await methods.trigger(currentStepFields);
                        if (isValid) {
                          setStep(step + 1);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                  {step === steps.length - 1 && (
                    <Button onClick={() => {
                      router.push("/signin")
                    }} variant="outline" type="submit">
                      Submit
                    </Button>
                  )}
                  
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiStepForm;
