// pages/auth/verify.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email?token=${token}`);
        setMessage(res.data.message);
        setTimeout(() => router.push("/auth/registernext"), 3000); // Redirect to login after 3 seconds
      } catch (error) {
        setMessage("Verification failed. The link may have expired.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}