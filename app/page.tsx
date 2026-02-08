"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { myAppHook } from "@/context/AppUtils";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = myAppHook();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/auth/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
}
