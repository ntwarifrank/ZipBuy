"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get("token");
    
    if (token) {
      // User is logged in, redirect to homepage
      router.push("/homepage");
    } else {
      // User is not logged in, redirect to login page
      router.push("/login");
    }
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightGray">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-alibabaOrange"></div>
    </div>
  );
}
