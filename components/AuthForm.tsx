"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormInput from "./CustomFormInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/user.actions";
import { signIn } from "@/lib/actions/user.actions";

const formSchema = ({ type }: { type: "sign-up" | "sign-in" }) =>
  z.object({
    // sign up
    firstName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(3),
    address: type === "sign-in" ? z.string().optional() : z.string().max(50),
    city: type === "sign-in" ? z.string().optional() : z.string().max(50),
    state: type === "sign-in" ? z.string().optional() : z.string().length(2),
    postalCode:
      type === "sign-in" ? z.string().optional() : z.string().length(5),
    dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().date(),
    // ssn: type === "sign-in" ? z.string().optional() : z.string().length(9),
    ssn:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .regex(
              /^\d{3}-\d{2}-\d{4}$/,
              "SSN must be in the format XXX-XX-XXXX"
            ),
    // sign up & sign in
    email: z.string().email(),
    password: z.string().min(8),
  });

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema({ type })),
    defaultValues: {
      email: "",
      password: "",
      ...(type === "sign-up" && {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        dateOfBirth: "",
        ssn: "",
      }),
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<ReturnType<typeof formSchema>>) => {
    setIsLoading(true);

    try {
      // Sign up with Appwrite & create plaid token
      if (type === "sign-up") {
        const newUser = await signUp(values as SignUpParams);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: values.email,
          password: values.password,
        } as signInProps);
        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex  cursor-pointer items-center gap-1">
          <Image
            src="/icons/logo.svg"
            alt="Walletly logo"
            width={34}
            height={34}
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Walletly
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Connect your account to get started"
                : "Please enter your account details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* TODO: Plaid Link */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomFormInput<ReturnType<typeof formSchema>>
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      type="text"
                      placeholder="Enter your first name"
                    />
                    <CustomFormInput<ReturnType<typeof formSchema>>
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      type="text"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <CustomFormInput<ReturnType<typeof formSchema>>
                    control={form.control}
                    name="address"
                    label="Address"
                    type="text"
                    placeholder="Enter your address"
                  />
                  <CustomFormInput<ReturnType<typeof formSchema>>
                    control={form.control}
                    name="city"
                    label="City"
                    type="text"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomFormInput<ReturnType<typeof formSchema>>
                      control={form.control}
                      name="state"
                      label="State"
                      type="text"
                      placeholder="Eample: MA"
                    />
                    <CustomFormInput<ReturnType<typeof formSchema>>
                      control={form.control}
                      name="postalCode"
                      label="Zip Code"
                      type="number"
                      placeholder="02360"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomFormInput<ReturnType<typeof formSchema>>
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      placeholder="MM/DD/YYYY"
                    />
                    <CustomFormInput<ReturnType<typeof formSchema>>
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      type="password"
                      placeholder="Example: 123-45-6789"
                    />
                  </div>
                </>
              )}
              <CustomFormInput<ReturnType<typeof formSchema>>
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <CustomFormInput<ReturnType<typeof formSchema>>
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
