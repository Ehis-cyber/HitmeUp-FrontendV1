'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

type RegisterFormInputs = {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    password: string;
    userType: string;
};

const RegisterPage = () => {
    const [formMessage, setFormMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { isValid, errors, isSubmitting },
    } = useForm<RegisterFormInputs>({
        mode: "onChange",
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        setFormMessage(""); 
        setLoading(true);
        try {
            console.log("Registration Data:", data); // Debugging: Log the data being sent
            // Send registration data to the backend
            const res = await axios.post("http://localhost:8800/api/auth/register", data);
            setFormMessage("Registration successful! Please check your email for verification.");
            router.push("/auth/registernext"); // Redirect to the next step
        } catch (error: any) {
            console.error("Registration error:", error);
            setFormMessage(error.response?.data?.message || "Registration failed, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Link href="/">
                <div className="absolute top-4 left-4">
                    <span className="text-2xl font-bold text-logo font-['AldransAltW00-Medium']">hitmeup!</span>
                </div>
            </Link>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-950">Create an Account</h1>

                {formMessage && (
                    <p className={`text-center mb-4 ${formMessage.includes("successful") ? "text-green-500" : "text-red-500"}`}>
                        {formMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input
                        type="text"
                        placeholder="First name"
                        {...register("firstname", { required: "First name is required" })}
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}

                    <input
                        type="text"
                        placeholder="Last name"
                        {...register("lastname", { required: "Last name is required" })}
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}

                    <input
                        type="tel"
                        placeholder="Phone number"
                        {...register("phoneNumber", { required: "Phone number is required" })}
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}

                    <input
                        type="email"
                        placeholder="Email address"
                        {...register("email", { required: "Email is required" })}
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: "Password is required" })}
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    <select
                        {...register("userType", { required: "Role is required" })}
                        className="w-full p-3 mb-4 border rounded focus:outline-none focus:border-purple-600"
                    >
                        <option value="">Select account type</option>
                        <option value="individual">Tasker</option>
                        <option value="business">Client</option>
                    </select>
                    {errors.userType && <p className="text-red-500 text-sm">{errors.userType.message}</p>}

                    <button
                        type="submit"
                        className={`w-full bg-brandcolor text-white py-2 rounded transition ${
                            !isValid || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
                        }`}
                        disabled={isSubmitting || !isValid || loading}
                    >
                        {isSubmitting || loading ? "Submitting..." : "Sign Up"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-950 hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;