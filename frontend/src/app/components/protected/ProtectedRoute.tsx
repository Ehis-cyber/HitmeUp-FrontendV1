'use client';

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a request to a protected route to verify authentication
       const res =  await axios.get("http://localhost:8800/api/auth/verify", {
          withCredentials: true, // Include cookies in the request
        });
        console.log("Authentication verified:", res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("User is not authenticated:", err);
        router.push("/auth/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading indicator while checking authentication
  }

  if (!isAuthenticated) {
    return null; // Render nothing if not authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;