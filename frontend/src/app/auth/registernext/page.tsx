"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { differenceInYears } from "date-fns";

type RegistrationFormInputs = {
    username: string;
    NIN: string;
    gender: string;
    birthDate: string;
    profilePicture?: File;
};

export default function RegistrationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
        reset,
    } = useForm<RegistrationFormInputs>({
        mode: "onChange",
    });

    const validateAge = (birthDate: string) => {
        const age = differenceInYears(new Date(), new Date(birthDate));
        return age >= 16 ? true : "You must be at least 16 years old to register.";
    };


    const onSubmit = async (data: RegistrationFormInputs) => {
        setIsSubmitting(true);
        setFormMessage("");

        try {
            // Validate the age
            const ageError = validateAge(data.birthDate);
            if (ageError !== true) {
                setFormMessage(ageError);
                return;
            }

            // Create FormData to send the file and other data
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("NIN", data.NIN);
            formData.append("gender", data.gender);
            formData.append("birthDate", data.birthDate);
            if (profilePicture) {
                formData.append("profilePicture", profilePicture); // Add the file
            }

            // Send data to the backend
            const res = await axios.post("http://localhost:8800/api/auth/registernext", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the content type
                },
                withCredentials: true, // Include the accessToken cookie
            });

            setFormMessage("Registration successful!");
            reset(); // Reset the form
            router.push("/"); // Redirect to the homepage or dashboard
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setFormMessage(error.response?.data?.message || "An error occurred. Please try again.");
            } else {
                setFormMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
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
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-950">Almost Done!</h1>

                {formMessage && (
                    <p className={`text-center mb-4 ${formMessage === "Registration successful!" ? "text-green-500" : "text-red-500"}`}>
                        {formMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className="w-full p-3 border rounded focus:outline-none focus:border-purple-600"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="NIN" className="block text-sm font-medium text-gray-700">
                            National Identification Number (NIN)
                        </label>
                        <input
                            id="NIN"
                            type="text"
                            {...register("NIN", { required: "NIN is required" })}
                            className="w-full p-3 border rounded focus:outline-none focus:border-purple-600"
                        />
                        {errors.NIN && <p className="text-red-500 text-sm">{errors.NIN.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            id="gender"
                            {...register("gender", { required: "Gender is required" })}
                            className="w-full p-3 border rounded focus:outline-none focus:border-purple-600"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                            Birth Date
                        </label>
                        <input
                            id="birthDate"
                            type="date"
                            {...register("birthDate", { required: "Birth date is required" })}
                            className="w-full p-3 border rounded focus:outline-none focus:border-purple-600"
                        />
                        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                            Profile Picture
                        </label>
                        <input
                            id="profilePicture"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setProfilePicture(e.target.files[0]); // Save the file to state
                                }
                            }}
                            className="w-full p-3 border rounded focus:outline-none focus:border-purple-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}