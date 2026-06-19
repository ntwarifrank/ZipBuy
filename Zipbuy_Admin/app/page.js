"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/homepage");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F4F0]">
      <div className="w-6 h-6 border-2 border-[#0D0D0D]/20 border-t-[#FFC831] rounded-full animate-spin" />
    </div>
  );
}
