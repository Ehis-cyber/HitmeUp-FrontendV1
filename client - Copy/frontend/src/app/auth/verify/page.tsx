// pages/auth/verify.js

"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/app/firebase/firebaseConfig";  // Firebase config
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Verify() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.emailVerified) {
          setIsVerified(true); 
        }
      } else {
        setIsLoggedIn(false);
        setIsVerified(false);
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleResendVerificationEmail = async () => {
    if (!isLoggedIn) return;

    setIsSending(true);

    try {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        alert("Verification email sent. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("An error occurred while sending the verification email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleGoBack = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        {isLoggedIn ? (
          isVerified ? (
            <div>
              <h2 className="text-lg text-green-600">Your email is already verified!</h2>
              <button
                onClick={handleGoBack}
                className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg mb-4">Please verify your email address to continue.</h2>
              <p className="text-sm text-gray-500 mb-4">
                We've sent a verification link to your email. Please check your inbox.
              </p>
              <button
                onClick={handleResendVerificationEmail}
                className="py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-800"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          )
        ) : (
          <div>
            <h2 className="text-lg text-red-600">You must be logged in to verify your email.</h2>
            <button
              onClick={handleGoBack}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
