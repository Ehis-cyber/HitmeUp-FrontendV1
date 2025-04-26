"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import newRequest from "@/app/utils/newRequest"; // Adjust the import path as necessary


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter(); // Initialize useRouter for navigation

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        try {
            setLoading(true);
            setError(null); // Clear any previous errors
            
    // Send login request to the backend
    const res = await newRequest.post("http://localhost:8800/api/auth/login", { email, password },{
        withCredentials: true, // Ensure cookies are sent with the request
    });
    
    console.log("Login successful:", res.data);

            // Redirect to the dashboard after successful login
            router.push("/");
        } catch (err) {
            // Handle errors and set the error message
            if (axios.isAxiosError(err)) {
                console.error("Axios Error:", err.response || err.message || err);
                setError(err.response?.data?.message || "An error occurred while logging in.");
            } else {
                console.error("Unexpected Error:", err);
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
            <Link href="/">
                <div className="absolute top-4 left-4">
                    <span className="text-2xl font-bold text-logo font-['AldransAltW00-Medium']">hitmeup!</span>
                </div>
            </Link>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-950">
                    Log In
                </h1>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-2 border rounded focus:outline-none focus:border-purple-600"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>
                <div className="text-center mt-4 flex flex-col">
                    <Link href="/auth/recover" className="text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                    <div>or</div>
                    <Link href="/auth/register" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;